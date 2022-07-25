# Chima Ifeanyi ThankGod

This is the backend REST API for the web app I built, click the link [bank](https://ifeanyi-bank.netlify.app) to view it.

To run the app use `npm start`

To install all the dependencies `npm install`

## New things I learnt

**$inc operator**

I discovered the `$inc` operator in mongo-DB, which I use to increase or decrease the user account balance depending on the amount.

source: [stackoverflow](https://stackoverflow.com/questions/71207726/creating-a-bank-transaction-with-express-mongo-db)

```javascript
// deposit
await Account.findByIdAndUpdate(accountId, {$inc: {balance: amount}}, {new: true});
```

**{new: true}**
This will return the result after the operation is carried out.

**LocaleTimeString**
This is used to return current time 

source: [stackoverflow](https://stackoverflow.com/questions/10599148/how-do-i-get-the-current-time-only-in-javascript/62589925#62589925)

```javascript
let date = new Date();
const timeStamp = date.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
```

**LocaleDateString**
I used this to format date to Nigerian format

```javascript
let date = new Date();
const currentDate = date.toLocaleDateString("en-NG")
```


**toLocaleString()**
I used this to format money bby adding commas

```javascript
const money = amount.toLocaleString("en-US")
```

## Deploy

This nodejs app is deployed on [Heroku](https://ifeanyi-bank-backend.herokuapp.com) 

## mongo-db

You need to set up a mongoDB database to store information.

# All rights reserved

**DO NOT COPY FOR AN ASSIGNMENT** - Avoid plagiarism and adhere to the spirit of this [Academic Honesty Policy](https://www.freecodecamp.org/news/academic-honesty-policy/)

Please do not steal my work, this took hard work and six days. 