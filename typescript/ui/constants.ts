// Values are based on the image found at http://clipart-library.com/images/rcjrpyEzi.png

export const CARD_WIDTH = 72
export const CARD_HEIGHT = 96
export const SX_VALUES_BY_CARD_VALUE = {
    // The sX value is calculated from the column of the card (starting with 0) and the number of pixel between each card.
    "a": CARD_WIDTH * 0 + 1,
    "2": CARD_WIDTH * 1 + 2,
    "3": CARD_WIDTH * 2 + 3,
    "4": CARD_WIDTH * 3 + 4,
    "5": CARD_WIDTH * 4 + 5,
    "6": CARD_WIDTH * 5 + 6,
    "7": CARD_WIDTH * 6 + 7,
    "8": CARD_WIDTH * 7 + 8,
    "9": CARD_WIDTH * 8 + 9,
    "10": CARD_WIDTH * 9 + 10,
    "j": CARD_WIDTH * 10 + 11,
    "q": CARD_WIDTH * 11 + 12,
    "k": CARD_WIDTH * 12 + 13,
}
export const SY_VALUES_BY_CARD_SUIT = {
    // The sY value is calculated from the row of the card (starting with 0) and the number of pixel between each card.
    "c": CARD_HEIGHT * 0 + 1,
    "s": CARD_HEIGHT * 1 + 3,
    "h": CARD_HEIGHT * 2 + 5,
    "d": CARD_HEIGHT * 3 + 7,
}
