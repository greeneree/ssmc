"""Peer Review Hackathon Banner - 1920x400px"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np, math, random, os

W, H = 1920, 400
FONT_DIR = "C:\\Windows\\Fonts\\"
OUT = os.path.join(os.path.dirname(__file__), "peer_review_banner.png")


# ──────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────
rng = random.Random(42)
np.random.seed(42)


def try_font(names, size):
    for n in names:
        try:
            return ImageFont.truetype(FONT_DIR + n, size)
        except Exception:
            pass
    return ImageFont.load_default()


def new_layer():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def star_pts(cx, cy, ro, ri, n=5, rot=0.0):
    pts = []
    for i in range(n * 2):
        a = math.pi / n * i + rot - math.pi / 2
        r = ro if i % 2 == 0 else ri
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def composite_star(base, cx, cy, ro, ri, color, glow_color, n=5, rot=0.0):
    pts = star_pts(cx, cy, ro, ri, n, rot)
    blur_r = max(ro // 2 + 6, 4)
    g = new_layer()
    ImageDraw.Draw(g).polygon(pts, fill=(*glow_color, 110))
    g = g.filter(ImageFilter.GaussianBlur(blur_r))
    s = new_layer()
    ImageDraw.Draw(s).polygon(pts, fill=(*color, 225))
    return Image.alpha_composite(Image.alpha_composite(base, g), s)


def glow_text(base, text, x, y, font, fg, glow, gr=14):
    g1 = new_layer()
    ImageDraw.Draw(g1).text((x, y), text, fill=(*glow, 185), font=font)
    g1 = g1.filter(ImageFilter.GaussianBlur(gr))
    g2 = new_layer()
    ImageDraw.Draw(g2).text((x, y), text, fill=(*glow, 120), font=font)
    g2 = g2.filter(ImageFilter.GaussianBlur(gr // 2 + 1))
    g3 = new_layer()
    ImageDraw.Draw(g3).text((x, y), text, fill=(*fg, 255), font=font)
    r = Image.alpha_composite(base.convert("RGBA"), g1)
    r = Image.alpha_composite(r, g2)
    return Image.alpha_composite(r, g3)


# ──────────────────────────────────────────────────────────────
# 1. Build background (numpy for smooth radial gradients)
# ──────────────────────────────────────────────────────────────
bg = np.zeros((H, W, 3), np.float64)
bg[:] = [6 / 255, 7 / 255, 13 / 255]
Yr, Xr = np.ogrid[:H, :W]


def add_glow(cx, cy, rgb, radius, strength=1.0, falloff=2):
    d = np.sqrt((Xr - cx) ** 2 + (Yr - cy) ** 2)
    m = np.clip(1 - d / radius, 0, 1) ** falloff * strength
    for i, v in enumerate(rgb):
        bg[:, :, i] = np.clip(bg[:, :, i] + m * v, 0, 1)


# Main orb — purple core, blue halo
add_glow(1370, 200, (0.07, 0.02, 0.24), 600, 1.0)
add_glow(1370, 200, (0.24, 0.08, 0.68), 360, 1.0)
add_glow(1370, 200, (0.48, 0.18, 1.00), 200, 1.3)
add_glow(1370, 200, (0.22, 0.38, 1.00), 115, 0.85)
add_glow(1370, 200, (0.50, 0.72, 1.00),  52, 1.4)   # brilliant centre

# Secondary accent orbs
add_glow(1740, 68,  (0.14, 0.24, 0.82), 230, 0.55)
add_glow(1810, 358, (0.00, 0.40, 0.70), 195, 0.42)
add_glow( 970, 325, (0.22, 0.07, 0.50), 165, 0.38)
add_glow(1600, 150, (0.10, 0.20, 0.70), 130, 0.30)

# Left-side darkening vignette
fade = np.linspace(0.52, 1.0, W)[np.newaxis, :, np.newaxis]
bg *= fade

# Subtle grid (right 55 %)
grid_col = np.array([0.17, 0.06, 0.38])
for gx in range(1050, W, 58):
    fi = min(1.0, (gx - 1050) / 480) * 0.11
    bg[:, gx] = np.clip(bg[:, gx] + grid_col * fi, 0, 1)
for gy in range(0, H, 58):
    fi_row = np.clip((np.arange(W) - 1050) / 480, 0, 1) * 0.055
    for i in range(3):
        bg[gy, :, i] = np.clip(bg[gy, :, i] + fi_row * grid_col[i], 0, 1)

img = Image.fromarray((np.clip(bg, 0, 1) * 255).astype(np.uint8), "RGB").convert("RGBA")


# ──────────────────────────────────────────────────────────────
# 2. Light-ray burst from orb centre
# ──────────────────────────────────────────────────────────────
burst = new_layer()
bd = ImageDraw.Draw(burst)
for ang in range(0, 360, 15):
    a = math.radians(ang)
    r1 = 58
    r2 = 210 + rng.randint(-35, 35)
    x1, y1 = int(1370 + r1 * math.cos(a)), int(200 + r1 * math.sin(a))
    x2, y2 = int(1370 + r2 * math.cos(a)), int(200 + r2 * math.sin(a))
    bd.line([(x1, y1), (x2, y2)], fill=(170, 110, 255, 28), width=1)
burst = burst.filter(ImageFilter.GaussianBlur(2))
img = Image.alpha_composite(img, burst)


# ──────────────────────────────────────────────────────────────
# 3. Floating stars
# ──────────────────────────────────────────────────────────────
stars = [
    (1152,  76, 32, 13, (225, 175, 255), (100, 38, 210)),
    (1602,  58, 23,  9, (185, 145, 255), ( 80, 28, 185)),
    (1818, 138, 19,  8, (140, 185, 255), ( 48,  80, 210)),
    (1058, 308, 21,  9, (165, 205, 255), ( 38,  82, 185)),
    (1698, 332, 25, 10, (205, 162, 255), ( 92,  40, 205)),
    (1875, 292, 16,  6, (122, 205, 255), ( 28, 102, 185)),
    (1215, 188, 40, 16, (240, 185, 255), (125,  52, 225)),  # hero
    (1488, 100, 21,  8, (182, 225, 255), ( 50, 105, 210)),
    (1905,  75, 13,  5, (205, 172, 255), ( 90,  40, 205)),
    (1300,  40, 17,  7, (195, 155, 255), ( 85,  35, 200)),
    (1820, 200, 14,  6, (155, 195, 255), ( 45,  90, 195)),
]
for (sx, sy, ro, ri, col, gcol) in stars:
    img = composite_star(img, sx, sy, ro, ri, col, gcol)


# ──────────────────────────────────────────────────────────────
# 4. VS emblem circle
# ──────────────────────────────────────────────────────────────
VS_CX, VS_CY, VS_R = 1105, 218, 50

# Glow ring
vs_glow = new_layer()
vgd = ImageDraw.Draw(vs_glow)
for r in range(VS_R + 18, VS_R - 2, -1):
    a = max(0, int(140 * (1 - (r - VS_R + 2) / 20)))
    vgd.ellipse([VS_CX - r, VS_CY - r, VS_CX + r, VS_CY + r],
                outline=(123, 47, 255, a), width=1)
vs_glow = vs_glow.filter(ImageFilter.GaussianBlur(5))
img = Image.alpha_composite(img, vs_glow)

# Filled circle
vs_circle = new_layer()
ImageDraw.Draw(vs_circle).ellipse(
    [VS_CX - VS_R, VS_CY - VS_R, VS_CX + VS_R, VS_CY + VS_R],
    fill=(28, 8, 68, 200), outline=(155, 80, 255, 220), width=2,
)
img = Image.alpha_composite(img, vs_circle)


# ──────────────────────────────────────────────────────────────
# 5. Trophy icon
# ──────────────────────────────────────────────────────────────
TR_X, TR_Y = 1555, 205

trophy_glow = new_layer()
ImageDraw.Draw(trophy_glow).ellipse(
    [TR_X - 48, TR_Y - 52, TR_X + 48, TR_Y + 58], fill=(78, 112, 255, 70)
)
trophy_glow = trophy_glow.filter(ImageFilter.GaussianBlur(18))
img = Image.alpha_composite(img, trophy_glow)

trophy = new_layer()
trd = ImageDraw.Draw(trophy)
# Cup body
trd.ellipse([TR_X - 34, TR_Y - 40, TR_X + 34, TR_Y + 22], fill=(55, 88, 205, 220))
# Inner shine
trd.ellipse([TR_X - 22, TR_Y - 30, TR_X + 14, TR_Y + 6],  fill=(90, 132, 255, 140))
# Handles
trd.ellipse([TR_X - 50, TR_Y - 22, TR_X - 28, TR_Y + 10], outline=(78, 112, 255, 180), width=4)
trd.ellipse([TR_X + 28, TR_Y - 22, TR_X + 50, TR_Y + 10], outline=(78, 112, 255, 180), width=4)
# Stem
trd.rectangle([TR_X - 9, TR_Y + 20, TR_X + 9, TR_Y + 44],  fill=(55, 88, 205, 220))
# Base
trd.rectangle([TR_X - 24, TR_Y + 42, TR_X + 24, TR_Y + 52], fill=(55, 88, 205, 230))
# Gold star on cup
trd.polygon(star_pts(TR_X, TR_Y - 10, 14, 6), fill=(255, 215, 55, 240))
img = Image.alpha_composite(img, trophy)


# ──────────────────────────────────────────────────────────────
# 6. Star rating row (5 stars, bottom-right decoration)
# ──────────────────────────────────────────────────────────────
rating_layer = new_layer()
for si in range(5):
    rx = 1660 + si * 38
    ry = 310
    ro_s, ri_s = 13, 6
    pts = star_pts(rx, ry, ro_s, ri_s)
    if si < 4:
        ImageDraw.Draw(rating_layer).polygon(pts, fill=(255, 210, 50, 220))
    else:
        ImageDraw.Draw(rating_layer).polygon(pts, outline=(255, 210, 50, 150), width=2)
rating_blur = rating_layer.filter(ImageFilter.GaussianBlur(4))
img = Image.alpha_composite(img, rating_blur)
img = Image.alpha_composite(img, rating_layer)


# ──────────────────────────────────────────────────────────────
# 7. Particles
# ──────────────────────────────────────────────────────────────
part = new_layer()
pd = ImageDraw.Draw(part)
pcols = [
    (123, 47, 255), (78, 112, 255), (0, 212, 255),
    (200, 150, 255), (255, 255, 255), (148, 200, 255),
]
for _ in range(200):
    px = rng.randint(880, W - 4)
    py = rng.randint(4, H - 4)
    ps = rng.choice([1, 1, 1, 1, 2, 2, 2])
    pc = rng.choice(pcols)
    pa = rng.randint(55, 210)
    pd.ellipse([px - ps, py - ps, px + ps, py + ps], fill=(*pc, pa))
img = Image.alpha_composite(img, part)


# ──────────────────────────────────────────────────────────────
# 8. Left accent bar
# ──────────────────────────────────────────────────────────────
accent = new_layer()
ad = ImageDraw.Draw(accent)
ad.rectangle([80, 100, 84, 290], fill=(123, 47, 255, 160))
accent_blur = accent.filter(ImageFilter.GaussianBlur(3))
img = Image.alpha_composite(img, accent_blur)
img = Image.alpha_composite(img, accent)

# Thin horizontal line under PEER REVIEW label
hl = new_layer()
ImageDraw.Draw(hl).rectangle([105, 126, 310, 128], fill=(123, 47, 255, 140))
hl = hl.filter(ImageFilter.GaussianBlur(1))
img = Image.alpha_composite(img, hl)


# ──────────────────────────────────────────────────────────────
# 9. Text
# ──────────────────────────────────────────────────────────────
f_label    = try_font(["arialbd.ttf", "arial.ttf"], 14)
f_title    = try_font(["malgunbd.ttf", "malgun.ttf", "gulim.ttc"], 90)
f_subtitle = try_font(["malgun.ttf", "gulim.ttc", "arial.ttf"],   32)
f_vs       = try_font(["arialbd.ttf", "arial.ttf"],                40)

# PEER REVIEW
img = glow_text(img, "P E E R   R E V I E W", 105, 100, f_label,
                (182, 135, 255), (100, 48, 225), 7)

# 동료 평가
img = glow_text(img, "동료 평가", 96, 136, f_title,
                (255, 255, 255), (123, 47, 255), 24)

# Subtitle
img = glow_text(img, "우리회사에 맞는 fit ,  지금 바로 선택해 주세요!",
                108, 265, f_subtitle,
                (160, 174, 192), (80, 58, 165), 7)

# VS inside circle
img = glow_text(img, "VS", VS_CX - 23, VS_CY - 22, f_vs,
                (255, 255, 255), (123, 47, 255), 12)


# ──────────────────────────────────────────────────────────────
# 10. Edge vignette & save
# ──────────────────────────────────────────────────────────────
vig = new_layer()
vd = ImageDraw.Draw(vig)
for i in range(35):
    a = int(4.5 * i)
    vd.rectangle([i, i, W - i - 1, H - i - 1], outline=(0, 0, 0, a), width=1)
vig = vig.filter(ImageFilter.GaussianBlur(3))
final = Image.alpha_composite(img, vig).convert("RGB")

final.save(OUT, "PNG", dpi=(144, 144))
print(f"Saved → {OUT}  ({W}×{H}px)")
