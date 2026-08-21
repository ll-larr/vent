# -*- coding: utf-8 -*-
"""Собирает public/files/vent-pricelist-2026.pdf — прайс Vent Clean на A4.

Источник цен — ПРАЙС-ЛИСТ.md в корне репозитория: правьте оба вместе, а также
src/lib/pricing.ts для позиций, которые считает калькулятор.

    pip install reportlab
    python scripts/build-pricelist.py

Шрифты берутся системные (Windows): Georgia под заголовки — ровно так же
кириллица ведёт себя на сайте, где Fraunces её не покрывает; Segoe UI вместо
Inter Tight и Consolas вместо JetBrains Mono, потому что обе фирменные гарнитуры
лежат в .woff2, а reportlab понимает только TTF/OTF.
"""

import os
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, CondPageBreak, Frame,
                                PageTemplate, Paragraph, Spacer, Table,
                                TableStyle)

WIN = r"C:\Windows\Fonts"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARGGRAFF = os.path.join(ROOT, "public", "fonts", "Marggraff Kursiv Zarte.ttf")
OUT = os.path.join(ROOT, "public", "files", "vent-pricelist-2026.pdf")

pdfmetrics.registerFont(TTFont("Display",     os.path.join(WIN, "georgia.ttf")))
pdfmetrics.registerFont(TTFont("Display-B",   os.path.join(WIN, "georgiab.ttf")))
pdfmetrics.registerFont(TTFont("Body",        os.path.join(WIN, "segoeui.ttf")))
pdfmetrics.registerFont(TTFont("Body-B",      os.path.join(WIN, "segoeuib.ttf")))
pdfmetrics.registerFont(TTFont("Mono",        os.path.join(WIN, "consola.ttf")))
pdfmetrics.registerFont(TTFont("Mono-B",      os.path.join(WIN, "consolab.ttf")))
HAS_MARGGRAFF = os.path.exists(MARGGRAFF)
if HAS_MARGGRAFF:
    pdfmetrics.registerFont(TTFont("Accent", MARGGRAFF))

# --- палитра проекта -------------------------------------------------------
INK       = colors.HexColor("#141312")
INK_SOFT  = colors.HexColor("#56534c")
INK_FAINT = colors.HexColor("#8b877e")
BRAND     = colors.HexColor("#1e5c32")
CREAM     = colors.HexColor("#f6f3ec")
LINE      = colors.HexColor("#dfdcd3")
LINE_SOFT = colors.HexColor("#ecEAe2")

PAGE_W, PAGE_H = A4
M_L = M_R = 17 * mm
M_TOP = 34 * mm
M_BOT = 20 * mm

# --- стили -----------------------------------------------------------------
s_svc = ParagraphStyle("svc", fontName="Body", fontSize=9.0, leading=11.6,
                       textColor=INK)
s_sub = ParagraphStyle("sub", fontName="Body", fontSize=7.3, leading=9.2,
                       textColor=INK_FAINT, spaceBefore=0.8)
s_price = ParagraphStyle("price", fontName="Mono-B", fontSize=9.2, leading=11.6,
                         textColor=INK, alignment=TA_RIGHT)
s_group = ParagraphStyle("group", fontName="Mono-B", fontSize=7.2, leading=9.4,
                         textColor=BRAND, spaceBefore=0, spaceAfter=0)
s_foot = ParagraphStyle("foot", fontName="Body", fontSize=7.6, leading=10.6,
                        textColor=INK_FAINT)
s_lede = ParagraphStyle("lede", fontName="Body", fontSize=9, leading=13,
                        textColor=INK_SOFT)

def svc(name, sub=None):
    """Ячейка услуги: название плюс необязательное уточнение."""
    cells = [Paragraph(name, s_svc)]
    if sub:
        cells.append(Paragraph(sub, s_sub))
    return cells

def price(value, unit=None):
    txt = value if not unit else (
        '%s <font name="Mono" size="7.6" color="#8b877e">%s</font>' % (value, unit))
    return Paragraph(txt, s_price)

# --- данные ----------------------------------------------------------------
G = "GROUP"
ROWS = [
    (G, "I \u00b7 \u041e\u0431\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435, \u0434\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u043a\u0430, \u0437\u0430\u043c\u0435\u0440\u044b"),
    ("Видеоинспекция воздуховодов, дымоходов, вытяжек, канализации",
     "фото- и видеоотчёт в электронном виде, выезд", "от 1 275 ₽", None),
    ("Видеоинспекция вентиляции сверх включённого метража",
     "определение состояния с записью", "45 ₽", "/ пог. м"),
    ("Отчёт по результатам видеообследования", None, "850 ₽", None),
    ("Замер параметров",
     "температура, давление, влажность, расход и скорость потока", "170 ₽", "/ точка"),
    ("Протокол замеров скорости потока по объекту",
     "сертифицированные анемометры TESTO", "от 4 250 ₽", None),
    ("Санитарно-эпидемиологическое обследование",
     "с составлением акта", "4 250 ₽", None),

    (G, "II \u00b7 \u041e\u0447\u0438\u0441\u0442\u043a\u0430 \u043e\u0442 \u043f\u044b\u043b\u0438, \u0449\u0451\u0442\u043e\u0447\u043d\u043e-\u0432\u0430\u043a\u0443\u0443\u043c\u043d\u044b\u0439 \u043c\u0435\u0442\u043e\u0434"),
    ("Воздуховод, D до 500 мм", None, "от 85 ₽", "/ пог. м"),
    ("Воздуховод, D от 500 мм", None, "от 130 ₽", "/ пог. м"),
    ("Короб, сечение до 500×300 мм", None, "от 130 ₽", "/ пог. м"),
    ("Короб, сечение от 500×300 мм", None, "от 180 ₽", "/ пог. м"),
    ("Гибкий воздуховод, Ø до 600 мм", None, "65 ₽", "/ пог. м"),
    ("Внешняя чистка и обеспыливание воздуховодов", None, "215 ₽", "/ м²"),
    ("Приточная камера, внутренняя обработка", None, "725 ₽", "/ м²"),
    ("Приточные и вытяжные установки", "расход воздуха до 10 000 м³/ч",
     "от 4 250 ₽", None),
    ("Крыльчатка вентилятора ВП/ВВ", "пыль", "1 700 ₽", "/ шт"),
    ("Промывка потолочных и настенных решёток", None, "130 ₽", "/ шт"),

    (G, "III \u00b7 \u041e\u0447\u0438\u0441\u0442\u043a\u0430 \u043e\u0442 \u0436\u0438\u0440\u0430, \u0449\u0435\u043b\u043e\u0447\u043d\u043e-\u0449\u0451\u0442\u043e\u0447\u043d\u044b\u0439 \u043c\u0435\u0442\u043e\u0434 \u0441 \u0437\u0430\u043f\u0435\u043d\u0438\u0432\u0430\u043d\u0438\u0435\u043c"),
    ("Воздуховод, D до 500 мм", None, "от 340 ₽", "/ пог. м"),
    ("Воздуховод, D от 500 мм", None, "от 470 ₽", "/ пог. м"),
    ("Короб, сечение до 500×300 мм", None, "от 340 ₽", "/ пог. м"),
    ("Короб, сечение от 500×300 мм", None, "от 470 ₽", "/ пог. м"),
    ("Зонт с жировыми фильтрами, до 1500×1500", None, "от 1 700 ₽", "/ шт"),
    ("Зонт с жировыми фильтрами, более 1500×1500", None, "от 2 550 ₽", "/ шт"),
    ("Крыльчатка вытяжного или мангального вентилятора",
     "жир и сажа, щелочная обработка", "от 2 550 ₽", "/ шт"),
    ("Гидрофильтр мангальный", None, "от 1 700 ₽", "/ шт"),

    (G, "IV \u00b7 \u0421\u043e\u043f\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u0435 \u0440\u0430\u0431\u043e\u0442\u044b"),
    ("Врезка дренажного сливного нержавеющего клапана",
     "с последующей герметизацией", "от 850 ₽", "/ шт"),

    (G, "V \u00b7 \u0414\u044b\u043c\u043e\u0445\u043e\u0434\u044b \u0432 \u0436\u0438\u043b\u044b\u0445 \u0434\u043e\u043c\u0430\u0445"),
    ("Обследование, видеодиагностика с видеоотчётом", None, "от 4 250 ₽", None),
    ("Механическая очистка", "пробивка гирей со щёткой, дымоходной пулей",
     "170 – 850 ₽", None),

    (G, "VI \u00b7 \u0414\u0435\u0437\u0438\u043d\u0444\u0435\u043a\u0446\u0438\u044f \u0432\u0435\u043d\u0442\u0441\u0438\u0441\u0442\u0435\u043c"),
    ("Воздуховоды, мелкодисперсное распыление",
     "генератор холодного тумана", "от 25 ₽", "/ пог. м"),
    ("Система кондиционирования, бытовая сплит-система", None, "от 170 ₽", "/ шт"),
    ("Анализ на ОМЧ", "с санэпидзаключением аккредитованной лаборатории",
     "от 1 275 ₽", "/ шт"),
    ("Анализ на БГКП", "с санэпидзаключением аккредитованной лаборатории",
     "от 2 125 ₽", "/ шт"),

    (G, "VII \u00b7 \u0422\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u0435"),
    ("Чиллеры", None, "17 000 ₽", None),
    ("Гидромодули к чиллерам", None, "4 250 ₽", None),
    ("Фанкойлы", None, "1 275 ₽", None),
    ("Приточные установки", None, "5 100 ₽", None),
    ("Компрессорно-конденсаторный блок", None, "8 500 ₽", None),
    ("Центральные кондиционеры", None, "21 250 ₽", None),
    ("Мультизональные кондиционеры", None, "10 200 ₽", None),
    ("Драйкулеры", None, "12 750 ₽", None),
    ("Промышленная вентиляция свыше 50 000 м³/ч", None, "17 000 ₽", None),
    ("Проверка систем вентиляции",
     "диагностика работоспособности узлов и элементов", "8 500 ₽", None),
    ("Замена теплообменников вентиляции", None, "12 750 ₽", None),
]

# --- сборка таблицы --------------------------------------------------------
COL_W = [(PAGE_W - M_L - M_R) * 0.735, (PAGE_W - M_L - M_R) * 0.265]

BASE_STYLE = [
    ("VALIGN",      (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING",(0, 0), (-1, -1), 0),
]

def group_table(title, rows):
    """Одна таблица на раздел: цветная шапка плюс её строки."""
    data = [[Paragraph(title, s_group), ""]]
    style = list(BASE_STYLE) + [
        ("SPAN",          (0, 0), (1, 0)),
        ("BACKGROUND",    (0, 0), (1, 0), CREAM),
        ("TOPPADDING",    (0, 0), (1, 0), 5),
        ("BOTTOMPADDING", (0, 0), (1, 0), 4.5),
        ("LEFTPADDING",   (0, 0), (1, 0), 7),
        ("RIGHTPADDING",  (0, 0), (1, 0), 7),
        ("LINEABOVE",     (0, 0), (1, 0), 0.6, LINE),
        ("LINEBELOW",     (0, 0), (1, 0), 0.6, LINE),
    ]
    for name, sub, value, unit in rows:
        i = len(data)
        data.append([svc(name, sub), price(value, unit)])
        style += [
            ("TOPPADDING",    (0, i), (1, i), 4.6),
            ("BOTTOMPADDING", (0, i), (1, i), 4.6),
        ]
        if i > 1:
            style.append(("LINEABOVE", (0, i), (1, i), 0.4, LINE_SOFT))
    t = Table(data, colWidths=COL_W, repeatRows=1)
    t.setStyle(TableStyle(style))
    return t

# ROWS -> [(заголовок, [строки]), ...]
groups, title, bucket = [], None, []
for row in ROWS:
    if row[0] == G:
        if title:
            groups.append((title, bucket))
        title, bucket = row[1], []
    else:
        bucket.append(row)
groups.append((title, bucket))

# --- колонтитулы -----------------------------------------------------------
def furniture(canvas, doc):
    canvas.saveState()
    top = PAGE_H - 15 * mm

    # словесный знак
    canvas.setFillColor(INK)
    canvas.setFont("Display-B", 15)
    w = canvas.stringWidth("Vent", "Display-B", 15)
    canvas.drawString(M_L, top, "Vent")
    if HAS_MARGGRAFF:
        canvas.setFillColor(BRAND)
        canvas.setFont("Accent", 19)
        canvas.drawString(M_L + w + 3, top - 1, "clean")
    else:
        canvas.setFillColor(BRAND)
        canvas.setFont("Display", 15)
        canvas.drawString(M_L + w + 4, top, "clean")

    canvas.setFillColor(INK_FAINT)
    canvas.setFont("Mono", 7.2)
    canvas.drawRightString(PAGE_W - M_R, top + 1,
                           "ПРАЙС-ЛИСТ · ДЕЙСТВУЕТ С 20.08.2026")

    canvas.setStrokeColor(INK)
    canvas.setLineWidth(0.8)
    canvas.line(M_L, top - 6.5 * mm, PAGE_W - M_R, top - 6.5 * mm)

    # низ страницы
    base = 12 * mm
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(M_L, base + 5 * mm, PAGE_W - M_R, base + 5 * mm)

    canvas.setFillColor(INK_SOFT)
    canvas.setFont("Body", 7.6)
    canvas.drawString(M_L, base,
                      "+7 (495) 120-04-04   ·   hello@vent-clean.ru   ·   vent-clean.ru")
    canvas.setFillColor(INK_FAINT)
    canvas.setFont("Mono", 7.2)
    canvas.drawRightString(PAGE_W - M_R, base, "%d" % doc.page)
    canvas.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4,
                      leftMargin=M_L, rightMargin=M_R,
                      topMargin=M_TOP, bottomMargin=M_BOT,
                      title="Прайс-лист Vent Clean 2026",
                      author="Vent Clean", subject="Прайс-лист на 2026 год")
frame = Frame(M_L, M_BOT, PAGE_W - M_L - M_R, PAGE_H - M_TOP - M_BOT, id="body",
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=furniture)])

story = [
    Paragraph("Очистка, дезинфекция и обслуживание систем вентиляции. "
              "Указана минимальная стоимость работ: итоговая сумма считается "
              "по фактическому метражу трассы, сечению каналов и количеству "
              "узлов — после осмотра объекта.", s_lede),
    Spacer(1, 5 * mm),
]
for title, rows in groups:
    story.append(CondPageBreak(26 * mm))   # шапка раздела не остаётся одна внизу
    story.append(group_table(title, rows))
story += [
    Spacer(1, 6 * mm),
    Paragraph("Цены указаны в рублях и не являются публичной офертой. "
              "Стоимость отдельных работ зависит от степени загрязнения, "
              "доступа к каналам и графика работы объекта.", s_foot),
]
doc.build(story)
print("OK", OUT, os.path.getsize(OUT), "bytes")
