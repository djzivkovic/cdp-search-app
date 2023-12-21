# CDP Search Application

## Overview
The CDP Search Application provides a user interface to interact with CDPs (Collateralized Debt Positions) on the Ethereum blockchain. The application allows users to search and view specific CDPs based on various criteria such as collateral type, CDP ID, and active debt status. It uses the Web3.js library to interact with Ethereum smart contracts and fetch relevant CDP information.

<p align="center">
  <img src="https://github.com/djzivkovic/decenter-rnd-challenge/assets/58893177/56fb07f2-ee11-4bf3-87bd-2708e3b488be" width="500">
</p>

## Features

- Metamask Integration: Detects if Metamask is installed in the browser and provides functionalities accordingly.
- Chain Id Management: Monitors the Ethereum chain ID and prompts users to switch to Ethereum Mainnet if required.
- CDP Search: Allows users to search for CDPs based on collateral type, CDP ID, and active debt status.

## Prerequisites
Before running this application, ensure you have the following prerequisites:

- Node.js
- Metamask extension installed on your browser

## Installation
### Install dependencies:
```
npm install
```

## Configuration

Ensure you have the correct ABI and address details for the Ethereum smart contracts in the `constants.ts` file.

You can also change which collateral types are supported.

## Running the Application
To run the CDP Search Application locally, execute the following command:

```
npm start
```

This will start the development server, and you can access the application at [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Open the application in your browser.
- If Metamask is not installed, you'll receive a notification prompting you to install it.
- Ensure you are connected to the Ethereum Mainnet.
- Use the provided options and fields to search for specific CDPs based on your criteria.

## Author

Djordje Zivkovic
