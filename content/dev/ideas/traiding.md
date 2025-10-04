# Traiding Bot Strategies

::table-of-contents::

## Pattern recognition

**short-term**

recognize patterns in price movements to make buy/sell decisions.

- many features: training machine learning models, using technical indicators, etc.
- simple patterns: moving averages, support/resistance levels, trend lines.

## News-based trading

**long-term**

analyze news sentiment to predict market movements using AI.

- search for relevant news articles
- analyze sentiment (direction, intensity, probability)
- make trading decisions based on sentiment analysis

> This strategy can be executed parallel to other strategies, as it focuses on long-term trends.

## NEWS + AI + PATTERN RECOGNITION

- concentrate on one single stock (e.g. Tesla)
- use news-based trading for long-term trends
- use pattern recognition for short-term terms
- check if the trend falls to fast -> immediate sell
- check if the trend rises to fast -> immediate buy

## Agentic Traiding

AI agent gets tools to traide and fetch news and acts autonomously.

### Tools

- fetch news
- spawn agent (e.g. for sentiment analysis)
- buy stock
- sell stock
- check portfolio
- check stock price
- wait_for (time, event, condition (news, stock price, ...))
- make_note

### Problem Context Length

- agent can only remember a limited amount of information
- RAG for news articles and important events
- master agent can spawn sub-agents for specific tasks (e.g. sentiment analysis)
- tool for memoization (~make notes)
