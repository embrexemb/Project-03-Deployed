from flask import Flask, render_template, redirect, jsonify, send_from_directory, url_for, send_file
from flask.logging import default_handler
import logging
from flask_pymongo import PyMongo
import os
import sys

app = Flask(__name__)

#mongo = PyMongo(app, uri="mongodb://localhost:27017/notepad")
mongo = PyMongo(app, uri="mongodb+srv://Scott:nN5GELRQucw.qJb@cluster0.w73ay.mongodb.net/Project2?retryWrites=true&w=majority")
#mongoAgg = PyMongo(app, uri="mongodb+srv://Scott:nN5GELRQucw.qJb@cluster0.w73ay.mongodb.net/Project2-Aggregate?retryWrites=true&w=majority")

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/method')
def method():
   return render_template('methodology.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

#@app.route('/compare_stocks')
#def compare_stocks():
#    return render_template('compare_stocks.html')

@app.route('/nyse')
def nyse():
    return render_template('nyse.html')

@app.route('/nasdaq')
def nasdaq():
    return render_template('nasdaq.html')
    
#Mongo data fetch
@app.route('/mongo/data_fetch')
def data_fetch():
    a_stock = mongo.db.AMZN.find()
    stocks = []
    for stock in a_stock:
        stocks.append({
            '_id': str(stock['_id']),
            'ticker':'AMZN',
            'date': stock['index'],
            'open': stock['1-open'],
            'high': stock['2-high'],
            'low': stock['3-low'],
            'close':stock['4-close'],
            'volume':stock['5-volume']
        })

    return jsonify(stocks)


if __name__=="__main__":
    app.run(debug=True)