"""Builds the platform artwork: a ring of petals coiled around a torus,
in the Finance green blended into violet.

    python tools_platform_art.py out.png [seed] [phase]

Supersampled 3x and downscaled, which is what gives the edges their
antialiasing. Everything is deterministic off `seed`, so re-running it
reproduces the same artwork.
"""
import math
import random
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1600, 700
SS = 3
CW, CH = W * SS, H * SS


def hx(c):
    c = c.lstrip('#')
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    t = max(0.0, min(1.0, t))
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


# the two ends of the blend: Finance green into violet
GREEN = hx('#0a8f5e')
GREEN_LT = hx('#93e8c4')
VIOLET = hx('#6c50b2')
VIOLET_LT = hx('#c4b5fd')
PALE = hx('#f4fbf8')
DEEP = hx('#08301f')
RIM = hx('#5fe0ad')          # the mint edge each petal catches

BG_A = hx('#eaf7f1')         # top left, green side
BG_B = hx('#e2dcf7')         # bottom right, violet side


def background():
    """a soft diagonal wash, green in one corner and violet in the other"""
    yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
    g = np.clip((xx / CW) * 0.65 + (yy / CH) * 0.35, 0, 1)
    img = np.zeros((CH, CW, 3), dtype=np.float32)
    for i in range(3):
        img[:, :, i] = BG_A[i] + (BG_B[i] - BG_A[i]) * g

    # a bloom behind the ring so it sits on light rather than on flat colour
    d = np.sqrt(((xx - CW * 0.5) / (CW * 0.34)) ** 2
                + ((yy - CH * 0.5) / (CH * 0.62)) ** 2)
    img += (np.clip(1.0 - d, 0, 1) ** 2)[:, :, None] * 30
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), 'RGB')


def petal(length, width, top, bot, rim):
    """One petal: narrow at the base, broad and rounded at the tip, filled
    with a gradient down its length and carrying a bright rim on one edge.

    The bitmap is sized so the petal's BASE sits at the exact centre and the
    petal points straight up. Rotating about that centre then pivots it on
    the ring, which is the only placement that keeps every petal radial."""
    pad = 8 * SS
    L = int(length)
    # square, so that rotating about the centre can never clip a corner —
    # a bitmap only as wide as the petal loses its tips once it turns
    w = h = 2 * (L + pad)
    cxp, cyp = w / 2.0, h / 2.0        # the base, and the pivot

    pts_r, pts_l = [], []
    for k in range(61):
        u = k / 60.0
        hw = width * (u ** 0.45) * max(0.0, 1.0 - u ** 6) ** 0.5
        y = cyp - u * L                # up from the base toward the tip
        pts_r.append((cxp + hw, y))
        pts_l.append((cxp - hw, y))
    poly = pts_r + pts_l[::-1]

    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).polygon(poly, fill=255)

    # the gradient runs along the petal, deep at the base and light at the tip
    grad = np.zeros((h, w, 3), dtype=np.float32)
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    t = np.clip((yy - 0.5) * 2.0 * (h / max(1.0, 2.0 * L)) + 1.0, 0, 1)
    for i in range(3):
        grad[:, :, i] = top[i] + (bot[i] - top[i]) * t
    face = Image.fromarray(np.clip(grad, 0, 255).astype(np.uint8), 'RGB').convert('RGBA')
    face.putalpha(mask)

    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    rl = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(rl).polygon([(x + 3.5 * SS, y + 2.5 * SS) for (x, y) in poly],
                               fill=rim + (255,))
    out.alpha_composite(rl)
    out.alpha_composite(face)
    return out


def build(seed, phase):
    img = background().convert('RGBA')
    rnd = random.Random(seed)

    N = 26
    cx, cy = CW * 0.5, CH * 0.5
    R = CH * 0.155                # radius of the ring the petals stand on
    LEN = CH * 0.27               # how far each petal reaches outward

    items = []
    for i in range(N):
        th = (i / N) * 2 * math.pi + phase

        # one open/closed cycle round the ring: petals face the viewer on
        # one side and turn edge-on on the other, which is what makes the
        # ring read as a coil rather than a flat rosette
        face_on = (1 + math.cos(th - 0.6)) / 2
        width = LEN * (0.055 + 0.235 * face_on)
        length = LEN * (0.86 + 0.20 * face_on)

        x = cx + R * math.cos(th)
        y = cy + R * math.sin(th) * 0.92

        # radial, then leaned off it so the ring spirals
        ang = -(math.degrees(th) + 90) - 16

        # Green on one side of the ring, violet on the other — routed
        # THROUGH the pale step rather than lerped straight across. A direct
        # green-to-violet mix passes through grey and greys out the whole
        # transition zone, which is what the middle of the ring was doing.
        blend = (1 + math.cos(th - math.pi * 0.35)) / 2
        base = (mix(mix(GREEN, GREEN_LT, 0.25), PALE, blend * 2)
                if blend < 0.5
                else mix(PALE, mix(VIOLET, VIOLET_LT, 0.30), (blend - 0.5) * 2))
        # the face-on petals are the pale ones, as in the reference
        base = mix(base, PALE, 0.30 * face_on)
        base = mix(base, (255, 255, 255), rnd.random() * 0.08)

        top = mix(base, (255, 255, 255), 0.30)
        bot = mix(base, DEEP, 0.30 + 0.22 * (1 - face_on))
        rim = mix(RIM, (255, 255, 255), 0.25)

        items.append((face_on, x, y, length, width, ang, top, bot, rim))

    # edge-on petals sit behind, face-on ones in front
    items.sort(key=lambda v: v[0])

    sh = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse(
        [cx - R * 1.5, cy + R * 0.75, cx + R * 1.5, cy + R * 1.45],
        fill=(30, 40, 80, 26))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(30 * SS)))

    for (_, x, y, length, width, ang, top, bot, rim) in items:
        pt = petal(length, width, top, bot, rim).rotate(
            ang, resample=Image.BICUBIC, expand=False)
        img.alpha_composite(pt, (int(x - pt.width / 2), int(y - pt.height / 2)))

    return img.convert('RGB').resize((W, H), Image.LANCZOS)


out = sys.argv[1]
seed = int(sys.argv[2]) if len(sys.argv) > 2 else 7
phase = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
build(seed, phase).save(out, quality=92)
print('wrote', out)
