import os
import shutil
import stat
import sys

def remove_readonly(func, path, _):
    os.chmod(path, stat.S_IWRITE)
    func(path)

uuid = "fb702581-2f1f-4073-b5ef-10358bd4558e"
parent_dir = os.path.dirname(os.path.realpath(__file__)) + "\\webServer_Folders"

db_dir = os.path.dirname(os.path.realpath(__file__)) + "\\databases"

zip_dir = os.path.dirname(os.path.realpath(__file__)) + "\\zipFiles"
zipath = zip_dir + '\\' + uuid + ".zip"

path = os.path.join(parent_dir, uuid)
destPath = parent_dir + '\\' + uuid
dbPath = db_dir + '\\' + uuid + "_db"

def deleteFiles(): 
    i = 0
    while i <=2:
        if i == 0:
            if os.path.exists(zipath):
                pathe = zipath

                os.remove(pathe)
        elif i<=1:
            pathe=dbPath
        else:
            pathe = destPath
        if i!=0:
            realpath = pathe
            pathe = "\\\\?\\" + pathe
            pathe = pathe.replace('/', '\\')
            while os.path.exists(realpath):
                try:
                    shutil.rmtree(pathe, onerror = remove_readonly)
                except OSError as e:
                    pass
        i += 1
    print("Deleting of request items Complete")