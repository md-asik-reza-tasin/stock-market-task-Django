from django.db import models

class StockData(models.Model):
    date = models.CharField(max_length=50)
    trade_code = models.CharField(max_length=50)
    high = models.FloatField()
    low = models.FloatField()
    open = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()  # use BigInteger for large numbers

    def __str__(self):
        return f"{self.trade_code} - {self.date}"
