# Musclery-Backend

Musclery TrainingsJournal - Backend

## Backend-Team:

Arthur Siebert, Lukas Blank, Tobias Bergmeier

## How to contribute

Before you start, make sure npm is available. <br>

##### Clone the repository

<pre><code>git clone https://github.com/Dennis2512/Musclery-Backend.git </pre></code><br>

##### Install firebase CLI

<pre><code>npm install -g firebase-tools</pre></code><br>

##### Log in to firebase

<pre><code>firebase login</pre></code><br>

This will redirect you to a page where you can properly log in to your Account linked with the firebase project.

##### Install dependencies

<pre><code>cd functions && npm install</pre></code><br>
Now you should be ready to contribute.

##### Pushing changes

<pre><code>firebase deploy --only functions:YourFunctionName</pre></code>

## References

Getting started with firebase: https://www.youtube.com/watch?v=DYfP-UIKxH0 </br>
Code examples: https://github.com/Dennis2512/Musclery-Backend/tree/master/examples
