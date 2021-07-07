import subprocess
import sys
import zipfile
import os
# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get the folder name and put in this variable to create DB of it

uuid = sys.argv[1]
parent_dir = os.path.dirname(os.path.realpath(__file__)) + "/webServer_Folders"

queriesToRun = sys.argv[2].split(",")
email = sys.argv[3]

dirPath = os.path.join(parent_dir, uuid)
destPath = parent_dir + '/' + uuid
os.mkdir(dirPath)

print("Directory '% s' created" % uuid)


zipPath = os.path.dirname(os.path.realpath(__file__)) + "/zipFiles/" + uuid +".zip"
with zipfile.ZipFile(zipPath, 'r') as zip_ref:
     zip_ref.extractall(destPath)

cmd = f"codeql database create ./backend/databases/{uuid}_db --source-root=./backend/webServer_Folders/{uuid} --language=javascript"
print("Creating database...")
process1= subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE)
# print(process1.returncode)
# print(process1.stderr)
# print(process1.stdout)
print("CodeQL Database Created.")

result_parent_dir = os.path.dirname(os.path.realpath(__file__)) + "/scanResults"

scanResultFolderName = uuid + '_scanResults'
scanResultFolderPath = f"./backend/scanResults/{scanResultFolderName}"

resultPath = os.path.join(result_parent_dir, scanResultFolderName)
os.mkdir(resultPath)

databaseName = uuid +"_db"
print(queriesToRun)

# get .ql filenames in the folder and put in a list
for query in queriesToRun:
     cweList = []
     queryCode = ""
     if query == "Injection":
          cweList = ["CWE-089"]

     #elif query == "Broken_Authentication":
          #cweList = []
     #Missing Some CWEs Check OWASP Website

     elif query == "Sensitive_Data_Exposure":
          cweList = ["CWE-312", "CWE-327"]
     #Missing Some CWEs Check OWASP Website

     elif query == "XML_External_Entities":
          cweList = ["CWE-611"]

     elif query == "Broken_Access_Control":
          cweList = ["CWE-022"]
     #Missing Some CWEs Check OWASP Website

     #elif query == "Security_Misconfiguration":
          #cweList = ["MISSING QUERY FILE"]
     #Missing Some CWEs Check OWASP Website

     elif query == "Cross-site_Scripting":
          cweList = ["CWE-079"]
     #Missing Some CWEs Check OWASP Website

     elif query == "Insecure_Deserialization":
          cweList = ["CWE-502"]
     #Missing Some CWEs Check OWASP Website

     # elif query == "Insufficient_Logging_&_Monitoring":
     #      cweList = ["MISSING QUERY FILE"] 

     #Missing Some CWEs Check OWASP Website
     elif query == "Improper_Input_Validation":
          cweList = ["CWE-020"]
     #Missing Some CWEs Check OWASP Website
     elif query == "OS_Command_Injection":
          cweList = ["CWE-078"]
     #Missing Some CWEs Check OWASP Website
     elif query == "Code_Injection":
          cweList = ["CWE-094"]
     #Missing Some CWEs Check OWASP Website

     # elif query == "Cross_Site_Request_Forgery":
     #      cweList = ["CWE-352"] 
     #Missing Some CWEs Check OWASP Website

     elif query == "Open_Redirect":
          cweList = ["CWE-601"]
     #Missing Some CWEs Check OWASP Website
     elif query == "XML_Entity_Expansion":
          cweList = ["CWE-776"]
     #Missing Some CWEs Check OWASP Website
     elif query == "Use_of_Hardcoded_Credentials":
          cweList = ["CWE-798"]
     #Missing Some CWEs Check OWASP Website

     for cwe in cweList:
          print("Scanning database for " + cwe)
          print(query)

          cmd = f"codeql database analyze --format=csv --output={scanResultFolderPath}/{query}-separator-{cwe}.csv --threads=4 --ram=8000 --no-rerun ./backend/databases/{databaseName} ../CodeQL-home/vscode-codeql-starter/ql/javascript/ql/src/Security/{cwe}"
          process2= subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE)
          # print(process2.returncode)
          # print(process2.stderr)
          # print(process2.stdout)
 
