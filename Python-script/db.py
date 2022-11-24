import urllib.request
import sqlalchemy as db
import pandas as pd

class DBActivities:
    def __init__(self, file_name, url) -> None:
        self.file_name = file_name
        self.url = url
    
    def download_file(self):
        try:
            with urllib.request.urlopen(self.url) as response, open(self.file_name, 'wb') as out_file:
                data = response.read()
                out_file.write(data)
            print('File downloaded successfully')
        except Exception as ex:
            raise Exception({
                'message': 'File cannot be downloaded',
                'error':str(ex)
                })
    
    def create_db_connection(self):
        try:
            DB_USER = 'root'
            DB_HOST = 'mysql_server' # change to 'localhost' to test on local machine
            DB_PASSWORD = 'root123'
            DB_NAME = 'covid_19_stats_test'
            mysql_engine = db.create_engine(f'mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}', echo=False)
            existing_databases = mysql_engine.execute("SHOW DATABASES;")
            existing_databases = [db[0] for db in existing_databases]
            if DB_NAME not in existing_databases:
                mysql_engine.execute(f'CREATE DATABASE {DB_NAME};')

            mysql_engine = db.create_engine(f'mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}', echo=False)
            db_conn = mysql_engine.connect()
            self.db_conn = db_conn
            print('DB Connection established')
        except Exception as ex:
            raise Exception({
                'message': 'DB connection could not be established',
                'error': str(ex)
                })

    def prepare_data(self):
        try:            
            covid_df = pd.read_csv(self.file_name)
            covid_df['submission_date'] = pd.to_datetime(covid_df.submission_date)
            covid_df['tot_cases'] = covid_df['tot_cases'].replace(to_replace=',', value='', regex=True)
            covid_df['new_case'] = covid_df['new_case'].replace(to_replace=',', value='', regex=True)
            covid_df['tot_death'] = covid_df['tot_death'].replace(to_replace=',', value='', regex=True)
            covid_df['new_death'] = covid_df['new_death'].replace(to_replace=',', value='', regex=True)
            columns = covid_df[['submission_date','state', 'tot_cases', 'new_case', 'tot_death', 'new_death']]
            self.required_df = pd.DataFrame(columns)
            print('Data prepared')
        except Exception as ex:
            raise Exception({
                'message': 'Data preparation failed',
                'error': str(ex)
                })

    def insert_data_to_db(self):
        try:
            table_name = 'stats_new'
            self.required_df.to_sql(name=table_name, con=self.db_conn, if_exists='replace', index=False, chunksize=1000)
            print('Data inserted in the table')
        except Exception as ex:
            raise Exception({
                'message': 'Importing data into table failed',
                'error': str(ex)
                })

try:
    url = 'https://data.cdc.gov/api/views/9mfq-cb36/rows.csv?accessType=DOWNLOAD&bom=true&format=true'
    file_name = 'covid-data.csv'
    class_obj = DBActivities(file_name, url)
    class_obj.download_file()
    class_obj.create_db_connection()
    class_obj.prepare_data()
    class_obj.insert_data_to_db()
except Exception as ex:
    print(ex)