"""
CheckiOReferee is a base referee for checking you code.
    arguments:
        tests -- the dict contains tests in the specific structure.
            You can find an example in tests.py.
        cover_code -- is a wrapper for the user function and additional operations before give data
            in the user function. You can use some predefined codes from checkio.referee.cover_codes
        checker -- is replacement for the default checking of an user function result. If given, then
            instead simple "==" will be using the checker function which return tuple with result
            (false or true) and some additional info (some message).
            You can use some predefined codes from checkio.referee.checkers
        add_allowed_modules -- additional module which will be allowed for your task.
        add_close_builtins -- some closed builtin words, as example, if you want, you can close "eval"
        remove_allowed_modules -- close standard library modules, as example "math"

checkio.referee.checkers
    checkers.float_comparison -- Checking function fabric for check result with float numbers.
        Syntax: checkers.float_comparison(digits) -- where "digits" is a quantity of significant
            digits after coma.

checkio.referee.cover_codes
    cover_codes.unwrap_args -- Your "input" from test can be given as a list. if you want unwrap this
        before user function calling, then using this function. For example: if your test's input
        is [2, 2] and you use this cover_code, then user function will be called as checkio(2, 2)
    cover_codes.unwrap_kwargs -- the same as unwrap_kwargs, but unwrap dict.

"""
import random

from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes
from checkio.referees import checkers
from multi_score import CheckiORefereeMultiScore

from tests import TESTS


SHIP = "S"
TORNADO = "O"
ROCK = "X"
EMPTY = "."

INIT_FUEL = 100

HUNT_DISTANCE = 2

DIRS = {
    "N": (-1, 0),
    "S": (1, 0),
    "W": (0, -1),
    "E": (0, 1),
    ".": (0, 0)
}


def prepare_map(grid, ship, tornadoes):
    grid = list(list(row) for row in grid)
    grid[ship[0]][ship[1]] = SHIP
    for t in tornadoes:
        grid[t[0]][t[1]] = TORNADO
    return tuple("".join(row) for row in grid)


def init(init_data):
    referee_data = {
        "ship": (0, 0),
        "new_ship": (0, 0),
        "old_tornadoes": init_data["tornadoes"],
        "new_tornadoes": init_data["tornadoes"],
        "tornado_moves": ["."] * len(init_data["tornadoes"]),
        "map": init_data["map"],
        "fuel": INIT_FUEL,
        "input": [prepare_map(init_data["map"], (1, 1), init_data["tornadoes"]), INIT_FUEL],
    }
    return referee_data

def process(data, user_result):
    if not isinstance(user_result, str) and user_result not in DIRS.keys():
        data.update({
            "result": False,
            "fuel": 0,
            "result_addon": "You should return a string with an action."
        })
    sx, sy = data["new_ship"]
    data["ship"] = (sx, sy)
    sea = data["map"]
    sea_width = len(sea[0])
    sea_height = len(sea)
    tornadoes = data["new_tornadoes"]
    new_sx, new_sy = sx + DIRS[user_result][0], sy + DIRS[user_result][1]
    data["new_ship"] = new_sx, new_sy
    if (new_sx, new_sy) in tornadoes:
        data.update({
            "result": False,
            "fuel": 0,
            "result_addon": "Dont move in a tornado! SOS"
        })
        return data
    if sea[new_sx][new_sy] == ROCK:
        data.update({
            "result": False,
            "fuel": 0,
            "result_addon": "ROCK! Turn to ... SOS"
        })
        return data
    if new_sx < 0 or new_sx >= len(sea) or new_sy < 0 or new_sy >= len(sea[0]):
        data.update({
            "result": False,
            "fuel": 0,
            "result_addon": "Captain, we lost."
        })
        return data

    data["fuel"] -= 1
    if (new_sx, new_sy) == (sea_height - 1, sea_width - 1):
        data.update({
            "result": True,
            "is_win": True,
            "result_addon": "Captain, we lost."
        })
        return data

    if data["fuel"] <= 0:
        data.update({
            "result": False,
            "fuel": 0,
            "result_addon": "We don't have fuel."
        })
        return data
    # Aaaaand tornado move
    data["old_tornadoes"] = tornadoes[:]
    tornado_moves = []
    rseed = data["seed"] + user_result
    random.seed(rseed)
    for i in range(len(tornadoes)):
        tx, ty = tornadoes[i]

        possible = []
        for direction, (dx, dy) in DIRS.items():
            x, y = tx + dx, ty + dy
            if 0 <= x < sea_height and 0 <= y < sea_width and sea[x][y] != ROCK and (x, y) not in tornadoes:
                possible.append((direction, (x, y)))
        distance = abs(sx - tx) + abs(sy - ty)
        if distance <= HUNT_DISTANCE:
            best = float("inf"), (tx, ty), "."
            for d, (x, y) in possible:
                possible_distance = abs(sx - x) + abs(sy - y)
                if possible_distance < best[0]:
                    best = possible_distance, (x, y), d
                elif possible_distance == best[0]:
                    best = random.choice([(possible_distance, (x, y), d), best])
            tornadoes[i] = best[1]
            tornado_moves.append(best[2])
        else:
            rand = random.choice(possible)
            tornadoes[i] = rand[1]
            tornado_moves.append(rand[0])
    data.update({"new_tornadoes": tornadoes[:], "tornado_moves": tornado_moves})
    if (new_sx, new_sy) in tornadoes:
        data.update({
            "result": False,
            "fuel": 0,
            "result_addon": "Tornado caught us, Cap."
        })
        return data
    data.update({
        "result": True,
        "input": [prepare_map(sea, (new_sx, new_sy), tornadoes), data["fuel"]],
        "result_addon": "Next move."
    })
    return data






api.add_listener(
    ON_CONNECT,
    CheckiORefereeMultiScore(
        tests=TESTS,
        cover_code={
            'python-27': cover_codes.unwrap_args,  # or None
            'python-3': cover_codes.unwrap_args
        },
        initial_referee=init,
        process_referee=process,
        is_win_referee=None,
        function_name="move_ship"
        # checker=None,  # checkers.float.comparison(2)
        # add_allowed_modules=[],
        # add_close_builtins=[],
        # remove_allowed_modules=[]
    ).on_ready)
