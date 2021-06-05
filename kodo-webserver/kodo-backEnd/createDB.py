import subprocess
import zipfile
import sys
import zipfile
import os
import removeReq
# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get the folder name and put in this variable to create DB of it

uuid = sys.argv[1]
parent_dir = os.path.dirname(os.path.realpath(__file__)) + "/webServer_Folders"

queriesToRun = sys.argv[2]
email = sys.argv[3]

dirPath = os.path.join(parent_dir, uuid)
destPath = parent_dir + '/' + uuid

os.mkdir(dirPath)
print("Directory '% s' created" % uuid)

zipPath = os.path.dirname(os.path.realpath(__file__)) + "/zipFiles/" + uuid +".zip"
with zipfile.ZipFile(zipPath, 'r') as zip_ref:
     zip_ref.extractall(destPath)

cmd = f"codeql database create ./kodo-backEnd/databases/{uuid}_db --source-root=./kodo-backEnd/webServer_Folders/{uuid} --language=javascript"
print("Creating database...")
process1= subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE)

print("CodeQL Database Created.")
print(process1.returncode)
print(process1.stderr)
print(process1.stdout)

result_parent_dir = os.path.dirname(os.path.realpath(__file__)) + "/scanResults"
scanResultFolderName = uuid + '_scanResults'
resultPath = os.path.join(result_parent_dir, scanResultFolderName)
os.mkdir(resultPath)

# get queries to run from backend server and put into this variable
databaseName = uuid +"_db"

# get .ql filenames in the folder and put in a list

for query in queriesToRun:
     print("Scanning database for " + query)
     cmd = f"codeql database analyze --format=csv --output=./kodo-backEnd/scanResults/{scanResultFolderName}/{query}_result.csv --threads=4 --ram=8000 --no-rerun ./kodo-backEnd/databases/{databaseName} ../CodeQL-home/vscode-codeql-starter/ql/javascript/ql/src/Security/{query}"
     process2= subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE)
     print("Scan with complete for " + query)
     print(process2.returncode)
     print(process2.stderr)
     print(process2.stdout)
     print("scanning completed! Now request deleting database, folder and zip file...")
removeReq.deleteFiles()