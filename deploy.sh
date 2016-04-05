#!/bin/bash

echo "Start npm install..."
sudo npm install

echo "Package up artifacts..."
zip ./buildartifact.zip -r * .[^.]*

echo "Running eb deploy..." 
eb deploy

echo "Cleanup packages..."
rm ./buildartifact.zip

echo "The deployment has been completed!"