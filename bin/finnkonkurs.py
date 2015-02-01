import csv
import time
import mysql.connector
import mandrill
import config
from jinja2 import Environment, FileSystemLoader, meta, Template

load = FileSystemLoader('.')
env = Environment(loader=load)

temp = open("email.html").read()
out_mail = Template(temp)


nn = {"konkurs": 0,
      "tvangsavvikling": 0,
      "avvikling": 0}

statuser = ["tvansavvikling","avvikling","konkurs"]

cnx = mysql.connector.connect(user=config.db_user, database='konkurs',
                              password=config.db_pw,
                              host="localhost")
cursor = cnx.cursor()


def send_mail(orgnr):
    orgnr = (orgnr,)
    query = "SELECT email from brukere JOIN subs ON subs.bruker_id=brukere.id WHERE subs.orgnr_id=%s;"
    cursor.execute(query, orgnr)
    ret = [i[0] for i in cursor.fetchall() if i[0]]
    api = config.api
    mail = mandrill.Mandrill(api)
    for i in ret:
        print("Sent a mail to "+i+" because of org "+orgnr[0]+"!")
        query = "SELECT orgnr, navn, addresse, tvangsavvikling, avvikling, konkurs from bedrifter where orgnr=%s;"
        cursor.execute(query,orgnr)
        data_ret = cursor.fetchall()[0]
        status = statuser[data_ret[-3:].index("J")]
        render = out_mail.render(orgnr=data_ret[0],status=status,navn=data_ret[1],addresse=data_ret[2])
        message = { "from_email": "autoreply@konkursvarsler.no",
                    "to":[{"email": "morten@linderud.pw"}],
                    "subject": "Konkurs varsel",
                    "html": render}
        mail.messages.send(message=message, async=True)


def update_database():
    with open("tmp/enhetsregisteret", newline="") as f:
        enhetsreader = csv.DictReader(f, delimiter=";", quotechar="\"")
        data_bedriftmany = []
        add_bedrift = ""
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
                        send_mail(row["orgnr"])


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
                    send_mail(row["orgnr"])


        cursor.executemany(add_bedrift, data_bedriftmany)
        cnx.commit()

    cursor.close()
    cnx.close()



if __name__ == '__main__':
    update_database()
