import csv
results = {}
scanResultFolderName = "52ee8fa3-3873-4737-a481-843de6fea701" + '_scanResults'
scanResultFolderPath = f"./backend/scanResults/{scanResultFolderName}"
csvList=["injection_result_CWE-089.csv", "sde_result_CWE-312.csv", "sde_result_CWE-327.csv"]
for csvFileString in csvList:
    resultList = []
    csvPath = f"{scanResultFolderPath}/{csvFileString}" 
    with open(csvPath, 'r') as csvFile:
        reader = csv.reader(csvFile)
        for row in reader:
                resultList.append(row)
        results[csvFileString] = resultList
print(results["injection_result_CWE-089.csv"])
print(results["sde_result_CWE-312.csv"])