import csv
import time
import mysql.connector


nn = {"konkurs": 0,
      "tvangsavvikling": 0,
      "avvikling": 0}

cnx = mysql.connector.connect(user='konkurs', database='konkurs',
                              password="abcdef1234",
                              host="188.166.48.220")
cursor = cnx.cursor()


"SELECT email from brukere JOIN subs ON subs.bruker_id=brukere.id WHERE subs.orgnr_id=\"999290345\";"

def update_database():
    with open("tmp/enhetsregisteret", newline="") as f:
        enhetsreader = csv.DictReader(f, delimiter=";", quotechar="\"")
        data_bedriftmany = []
        for row in enhetsreader:
            if "J" in (row["konkurs"], row["tvangsavvikling"], row["avvikling"]):
                if row["konkurs"] == "J":
                    nn["konkurs"] += 1
                if row["tvangsavvikling"] == "J":
                    nn["tvangsavvikling"] += 1
                if row["avvikling"] == "J":
                    nn["avvikling"] += 1


                get_bedrift = ("SELECT * FROM bedrifter WHERE orgnr=%s")
                data_bedrift = (row["orgnr"],)
                cursor.execute(get_bedrift, data_bedrift)
                ret = cursor.fetchall()
                if ret:
                    ret = ret[0]
                    if ret[-2]== "N":
                        # Sett tidligerekonkurs til J så varsel ikke sendes
                        # ut to ganger
                        update_bedrift = ("UPDATE bedrifter "
                                        "SET sistoppdatert=%s, "
                                        "tidligerekonk=%s "
                                        "WHERE orgnr=%s")

                        now = time.strftime('%Y-%m-%d %H:%M:%S')
                        data_bedrift = (now,"J",row["orgnr"],)
                        cursor.execute(update_bedrift,data_bedrift)


                else:
                    add_bedrift = ("INSERT INTO bedrifter "
                                "(orgnr, navn, addresse, postnummer, avvikling, konkurs, tvangsavvikling, sektorkode, nkode1, tidligerekonk, sistoppdatert)"
                                "VALUES (%s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s)")
                    now = time.strftime('%Y-%m-%d %H:%M:%S')
                    data_bedriftmany.append((row["orgnr"], row["navn"],
                                    row["forretningsadr"], row["forradrpostnr"],
                                    row["avvikling"], row["konkurs"],
                                    row["tvangsavvikling"], row["sektorkode"],
                                    row["nkode1"], "N", now,))


        cursor.executemany(add_bedrift, data_bedriftmany)
        cnx.commit()

    cursor.close()
    cnx.close()



if __name__ == '__main__':
    update_database()
