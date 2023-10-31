from flask import Flask, render_template, url_for, jsonify

app = Flask(__name__)


@app.route("/")
def welcome():
    return render_template("welcome.html")


@app.route("/play")
def play():
    return render_template("index.html")


@app.route("/get-questions")
def get_questions():
    with open("./questions.json", "r") as file:
        file = file.read()
        return jsonify(file)


if __name__ == "__main__":
    app.run(debug=True)
