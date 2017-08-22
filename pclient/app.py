import requests

import time
import datetime
import calendar

headers = {
    'authorization': 'SqgUQyyeVpLvvdN.l?DeJH_!fG7Q7C-I',
}


data = {
    'date': datetime.datetime.utcnow().isoformat(),
    'type': "test-event",
    'data': {
        "value":123,
        "xxx": "321"
    }
}



response = requests.post('http://everylistner.musuk.guru/api/add-event', headers = headers, json = data)
#response = requests.post('http://localhost:8088/api/add-event', headers = headers, json = data)
print response
