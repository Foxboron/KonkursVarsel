import csv
import mysql.connector


nn = {"konkurs": 0,
      "tvangsavvikling": 0,
      "avvikling": 0}

cnx = mysql.connector.connect(user='konkurs', database='konkurs',
                              password="abcdef1234",
                              host="188.166.48.220")
cursor = cnx.cursor()

with open("tmp/enhetsregisteret", newline="") as f:
    enhetsreader = csv.DictReader(f, delimiter=";", quotechar="\"")
    for row in enhetsreader:
        if "J" in (row["konkurs"], row["tvangsavvikling"], row["avvikling"]):
            if row["konkurs"] == "J":
                nn["konkurs"] += 1
            if row["tvangsavvikling"] == "J":
                nn["tvangsavvikling"] += 1
            if row["avvikling"] == "J":
                nn["avvikling"] += 1

            add_bedrift = ("INSERT INTO bedrifter "
                        "(orgnummer, navn, addresse, postnummer, avvikling, konkurs, tvangsavvikling) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s)")
            data_bedrift = (row["orgnr"], row["navn"],
                            row["forretningsadr"], row["forradrpostnr"],
                            row["avvikling"], row["konkurs"],
                            row["tvangsavvikling"])

            cursor.execute(add_bedrift, data_bedrift)

            cnx.commit()

cursor.close()
cnx.close()
