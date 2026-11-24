/* ================= Lexikon: Begriffe für die Erklärungen im Text =================
   Im Text: <span class="lx" data-lx="ti">Telematikinfrastruktur</span>
   Später speist dieselbe Liste die Lexikon-Seite. Keine Fristen oder Zahlen ohne Quelle. */
const LEX = {
  ti: { t: 'Telematikinfrastruktur (TI)', b: 'Gesundheitswesen', d: 'Das gesicherte Netz des Gesundheitswesens. Darüber tauschen Praxen, Apotheken, Pflegeeinrichtungen und Krankenkassen Daten aus, zum Beispiel für das E-Rezept oder die elektronische Patientenakte.' },
  erezept: { t: 'E-Rezept', b: 'Gesundheitswesen', d: 'Das elektronische Rezept. Es wird über die Telematikinfrastruktur ausgestellt und in der Apotheke eingelöst.' },
  epa: { t: 'Elektronische Patientenakte (ePA)', b: 'Gesundheitswesen', d: 'Eine digitale Akte für Gesundheitsdaten von Versicherten. Praxen greifen über die Telematikinfrastruktur darauf zu.' },
  smcb: { t: 'SMC-B', b: 'Gesundheitswesen', d: 'Der Ausweis einer Praxis, Apotheke oder Einrichtung in der Telematikinfrastruktur, als Karte oder digital.' },
  konnektor: { t: 'Konnektor', b: 'Gesundheitswesen', d: 'Ein Gerät, das die Praxis sicher mit der Telematikinfrastruktur verbindet, ähnlich einem besonders gesicherten Router.' },
  tigateway: { t: 'TI-Gateway', b: 'Gesundheitswesen', d: 'Der Zugang zur Telematikinfrastruktur über ein Rechenzentrum, statt über einen eigenen Konnektor vor Ort.' },
  kartenterminal: { t: 'Kartenterminal', b: 'Gesundheitswesen', d: 'Ein Lesegerät für Gesundheitskarten und den Praxis- oder Institutionsausweis (SMC-B), angebunden an die Telematikinfrastruktur.' },
  kim: { t: 'KIM', b: 'Gesundheitswesen', d: 'Kommunikation im Medizinwesen: der sichere E-Mail-Dienst der Telematikinfrastruktur, zum Beispiel für den elektronischen Arztbrief.' },
  ms: { t: 'Managed Services', b: 'Technik', d: 'IT-Leistungen, die wir dauerhaft für dich betreiben und betreuen, statt nur im Notfall zu helfen.' },
  backup: { t: 'Managed Backup', b: 'Technik', d: 'Datensicherung als Dienstleistung: Wir richten die Sicherung ein und kümmern uns darum, dass sie läuft.' },
  nas: { t: 'NAS', b: 'Technik', d: 'Network Attached Storage: ein Speichergerät im Netzwerk, auf dem mehrere Rechner Daten ablegen können.' },
  vm: { t: 'Virtuelle Maschine (VM)', b: 'Technik', d: 'Ein Rechner, der als Software auf einem Server läuft. Mehrere virtuelle Maschinen können sich einen Server teilen.' },
  sla: { t: 'SLA', b: 'Technik', d: 'Service Level Agreement: die schriftliche Vereinbarung, welche Leistungen wir dir zusichern.' },
  fernwartung: { t: 'Fernwartung', b: 'Technik', d: 'Wir schalten uns mit deiner Erlaubnis auf deinen Rechner und helfen direkt, ohne Anfahrt. Bei cloudvibe läuft das über QuickSupport.' },
  firewall: { t: 'Firewall', b: 'Technik', d: 'Ein Schutzsystem zwischen deinem Netzwerk und dem Internet, das unerwünschte Verbindungen blockiert.' },
  phishing: { t: 'Phishing', b: 'Technik', d: 'Gefälschte E-Mails oder Webseiten, die an Passwörter oder andere Daten kommen wollen.' },
  copilot: { t: 'Microsoft 365 Copilot', b: 'Technik', d: 'Der KI-Assistent in Microsoft 365, zum Beispiel in Outlook, Word und Teams. Er arbeitet mit allen Daten, auf die die jeweilige Person Zugriff hat.' },
  kivo: { t: 'KI-Verordnung', b: 'Recht', d: 'Das Gesetz der EU zu künstlicher Intelligenz (AI Act). Es regelt den Einsatz von KI-Systemen, gestaffelt nach ihrem Risiko.' },
  datev: { t: 'DATEV', b: 'Software', d: 'Software für Steuerberatung, Rechnungswesen und Lohn, verbreitet in Kanzleien und in der Buchhaltung von Unternehmen.' },
  selectline: { t: 'SelectLine', b: 'Software', d: 'Kaufmännische Software für den Mittelstand, mit Modulen für Warenwirtschaft, Rechnungswesen und Produktion.' },
  '3cx': { t: '3CX', b: 'Technik', d: 'Eine Telefonanlage als Software. Telefoniert wird über das Internet statt über eine klassische Anlage.' },
  // Prüfdokument 24.11.2026: auf den Seiten keinen Anbieter nennen, sondern hierher verweisen (Partner: 3CX, easybell)
  telefonie: { t: 'Telefonanlage (Cloud-Telefonie)', b: 'Technik', d: 'Telefonie über das Internet statt über eine klassische Anlage im Keller. Wir richten sie ein und betreuen sie, je nach Bedarf mit <b>3CX</b> als Telefonanlage oder mit <b>easybell</b> als Anbieter.' },
};
