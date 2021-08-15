from flask import Flask, render_template, redirect, jsonify, send_from_directory, url_for, send_file
from flask.logging import default_handler
import logging
from flask_pymongo import PyMongo
import os
import sys

app = Flask(__name__)

#mongo = PyMongo(app, uri="mongodb://localhost:27017/notepad")
#mongo = PyMongo(app, uri="mongodb+srv://Scott:qJb@cluster0.w73ay.mongodb.net/Project2?retryWrites=true&w=majority")
#mongoAgg = PyMongo(app, uri="mongodb+srv://Scott:nN5GELRQucw.qJb@cluster0.w73ay.mongodb.net/Project2-Aggregate?retryWrites=true&w=majority")

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/method')
def method():
   return render_template('methodology.html')

@app.route('/ml')
def ml():
    return render_template('ML.html')

@app.route('/team')
def team():
   return render_template('team.html')

@app.route('/air')
def air():
    return render_template('air.html')

@app.route('/location')
def location():
    return render_template('location.html')

@app.route('/test')
def test():
    return render_template('test.html')
   
if __name__=="__main__":
    app.run(debug=True)