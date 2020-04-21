'use strict';

class Stock 
{
    constructor(stockSymbol, stockExchange, stockName) 
    {
      this.stockExchange = stockExchange;
      this.stockSymbol = stockSymbol;
      this.stockName = stockName;
    }

    static CreateNewFromLine(line) 
    {
        const pipeTokens = line.split("|");

        var stock = new Stock
        (
            pipeTokens[0], 
            Stock.GetStockExchangeFromToken(pipeTokens[2]), 
            pipeTokens[1]
        );
        return stock;
    }

    static GetStockExchangeFromToken(token) 
    {
        //TODO: Cannot find exchange from source files. Try new source files?
        if (Math.random() > 0.5)
        {
            token = "NASDAQ";
        }
        else
        {
            token = "NYSE";
        }
        
        return token;
    }

    GetObject()
    {
        return {
            "stockExchange": this.stockExchange, 
            "stockSymbol": this.stockSymbol, 
            "stockName": this.stockName
        };
    }
  }
