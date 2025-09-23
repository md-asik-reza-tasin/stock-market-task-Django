from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import StockData
from .serializers import StockDataSerializer

import json
import os

@api_view(['POST', 'GET'])
def load_json_data(request):
    import os, json
    from .models import StockData

    file_path = os.path.join(os.getcwd(), 'data.json')
    if not os.path.exists(file_path):
        return Response({"error": "data.json not found"}, status=404)

    # Only insert if table is empty
    if StockData.objects.exists():
        return Response({"message": "Data already loaded"})

    with open(file_path, 'r') as file:
        data = json.load(file)

    for item in data:
        high = float(str(item['high']).replace(',', ''))
        low = float(str(item['low']).replace(',', ''))
        open_ = float(str(item['open']).replace(',', ''))
        close = float(str(item['close']).replace(',', ''))
        volume = int(str(item['volume']).replace(',', ''))

        StockData.objects.create(
            date=item['date'],
            trade_code=item['trade_code'],
            high=high,
            low=low,
            open=open_,
            close=close,
            volume=volume
        )

    return Response({"message": "Data imported from JSON successfully"})



# Get distinct trade codes
@api_view(['GET'])
def get_trade_codes(request):
    trade_codes = StockData.objects.values_list('trade_code', flat=True).distinct()
    return Response({"trade_codes": list(trade_codes)})

# Get stock data or all trade codes
@api_view(['GET'])
def get_stock_data(request):
    trade_code = request.GET.get('trade_code')
    if trade_code:
        stocks = StockData.objects.filter(trade_code=trade_code)
    else:
        stocks = StockData.objects.all()
    serializer = StockDataSerializer(stocks, many=True)
    return Response(serializer.data)

# Add new stock data
@api_view(['POST'])
def add_stock(request):
    serializer = StockDataSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Stock data added successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update stock data
@api_view(['PUT'])
def update_stock(request, id):
    try:
        stock = StockData.objects.get(id=id)
    except StockData.DoesNotExist:
        return Response({"error": "Stock data not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = StockDataSerializer(stock, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Stock data updated successfully"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete stock data
@api_view(['DELETE'])
def delete_stock(request, id):
    try:
        stock = StockData.objects.get(id=id)
        stock.delete()
        return Response({"message": "Data deleted successfully"})
    except StockData.DoesNotExist:
        return Response({"error": "Stock data not found"}, status=status.HTTP_404_NOT_FOUND)


