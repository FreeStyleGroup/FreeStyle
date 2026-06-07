#!/usr/bin/env python3
"""
clean_lineart.py — превращает линейный рисунок в чистую золотую графику
на прозрачном фоне БЕЗ белой каймы.

Принцип: «яркость → прозрачность». Каждый пиксель перекрашивается в один
золотой цвет, а альфа = насколько пиксель «чернильный» (255 - min(R,G,B)),
домноженная на исходную альфу. Белое (и белые заливки внутри) → alpha 0,
золотая линия → alpha 255, сглаженные края плавно гаснут в прозрачность.
Поэтому при наложении на любой фон не остаётся белого ореола.

Использование:
    py tools/clean_lineart.py <input.png> <output.png> [--color FFA726] [--boost 1.4] [--floor 8]
"""
import argparse
from PIL import Image, ImageChops


def hex_to_rgb(s: str):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def clean(in_path: str, out_path: str, color="FFA726", boost=1.4, floor=8):
    im = Image.open(in_path).convert('RGBA')
    r, g, b, a = im.split()

    # min(R,G,B) — для белого = 255, для насыщенной линии низкий
    mn = ImageChops.darker(ImageChops.darker(r, g), b)
    ink = ImageChops.invert(mn)              # 255 - min  → «чернильность»
    ink = ImageChops.multiply(ink, a)        # уважаем уже прозрачные зоны
    if boost != 1.0:
        ink = ink.point(lambda x: min(255, int(x * boost)))
    if floor > 0:
        ink = ink.point(lambda x: 0 if x < floor else x)  # глушим фоновый шум

    gr, gg, gb = hex_to_rgb(color)
    w, h = im.size
    out = Image.merge('RGBA', (
        Image.new('L', (w, h), gr),
        Image.new('L', (w, h), gg),
        Image.new('L', (w, h), gb),
        ink,
    ))
    out.save(out_path)
    print(f"ok: {in_path} -> {out_path}  ({w}x{h}, color #{color}, boost {boost}, floor {floor})")


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('input')
    p.add_argument('output')
    p.add_argument('--color', default='FFA726')
    p.add_argument('--boost', type=float, default=1.4)
    p.add_argument('--floor', type=int, default=8)
    args = p.parse_args()
    clean(args.input, args.output, args.color, args.boost, args.floor)
