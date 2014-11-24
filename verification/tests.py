"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""


TESTS = {
    "0. Basic": {
        "map": (
            ".....",
            ".XXX.",
            "...X.",
            ".XXX.",
            ".....",
        ),
        "tornadoes": [(2, 2)]
    },
    "1. Basic": {
        "map": (
            ".......",
            ".X.....",
            ".XXXX.X",
            ".X.....",
            ".X.X...",
            ".X.X...",
            ".X.X...",
            "...X...",
        ),
        "tornadoes": [(0, 6)]
    },
    "2. Basic": {
        "map": (
            ".........",
            ".X.X.X.X.",
            ".........",
            ".X.X.X.X.",
            ".........",
            ".X.X.X.X.",
            ".........",
            ".X.X.X.X.",
            ".........",
        ),
        "tornadoes": [(6, 2), (4, 4), (2, 6)]
    },
    "3. Empty": {
        "map": (
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
        ),
        "tornadoes": [(9, 0), (0, 8), (7, 2), (2, 6)]
    },
    "4. Columns": {
        "map": (
            ".....",
            ".X.X.",
            ".X.X.",
            ".X.X.",
            ".X.X.",
            ".X.X.",
            ".X.X.",
            ".X.X.",
            ".....",
        ),
        "tornadoes": [(4, 3), (4, 4)]
    },
    "5. From description": {
        "map": (
            "..........",
            "..........",
            "...XX.....",
            "....X.....",
            "....X.....",
            ".XXXXXX.XX",
            ".X...X...X",
            ".X.X.X.X.X",
            ".X.X.X.X..",
            "...X...X..",
        ),
        "tornadoes": [(0, 9), (1, 5)]
    },
    "6. Diagonal": {
        "map": (
            "..........",
            ".X....X...",
            "..X...X...",
            "...X..XXX.",
            "....X.....",
            "..........",
            ".XXX..X...",
            "...X...X..",
            "...X....X.",
            "..........",
        ),
        "tornadoes": [(5, 5), (1, 8), (8, 1)]
    },

    "9. You shall not pass": {
        "map": (
            "..........",
            ".....X....",
            ".....X....",
            ".....X....",
            ".....X....",
            "..........",
            ".....X....",
            ".....X....",
            ".....X....",
            "..........",
        ),
        "tornadoes": [(9, 5), (5, 5), (0, 5), (9, 9), (5, 9), (0, 9)]
    },


}
