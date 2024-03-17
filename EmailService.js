const nodemailer = require("nodemailer");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const EventHandler = new EventEmitter();

EventHandler.on('prepare_data', (obj) => {
    if (!obj.text && !obj.html && obj.src_path) {
        const message = fs.createReadStream(obj.src_path);
        obj.text = message;
        obj.html = message;
        delete obj.src_path;
    }
    if (obj.attached_files) {
        console.log(obj.path);
        attachments = [];
        obj.attached_files.forEach((data) => {
            console.log(data.path, data.filename);
            attachments.push({
                filename: data.filename,
                content: fs.createReadStream(data.path)
            });
        });
        delete obj.attached_files;
        obj.attachments = attachments;
    }
    delete obj.attachment_filename;
    delete obj.attachment_path;
    EventHandler.emit('send', obj);
});

EventHandler.on('send', (obj) => {
    obj.transporter.verify()
        .then(() => {
            const transporter = obj.transporter;
            delete obj.transporter;
            transporter.sendMail(obj).then((info) => {
                console.log(info);
                if (info.accepted.length > 0) {
                    EventHandler.emit('success', info.accepted);
                }
                if (info.rejected.length > 0) {
                    obj.to = String(info.rejected);
                    EventHandler.emit('reject', obj);
                }
            })
        })
        .catch((err) => {
            EventHandler.emit('fail', obj);
        });

});

class EmailService extends EventEmitter {
    #emailId;
    #passkey;
    #transporter;
    #throwError(err) {
        throw new Error(err);
    }
    #validateEmail(email) {
        if (typeof email !== 'string') {
            this.#throwError("Email should be in string format");
        }
        const chunk = email.split('@');
        if (chunk.length != 2) {
            this.#throwError("Email should be in format ---> abc@gmail.com");
        }
        if (chunk[1] !== "gmail.com") {
            this.#throwError("Domain of your email must be gmail.com");
        }
    }

    #validatePasskey(passkey) {
        if (typeof passkey !== 'string') {
            this.#throwError("Passkey should a string");
        }
        const chunk = passkey.split(' ');
        if (chunk.length !== 4) {
            this.#throwError("Passkey should be 16 length string in format ---> abcd efgf ijkl mnop");
        }
        if (chunk[0].length !== 4 || chunk[1].length !== 4 || chunk[2].length !== 4 || chunk[3].length !== 4) {
            this.#throwError("Passkey should in the in format ---> abcd efgf ijkl mnop");
        }
    }

    constructor(obj) {
        super();
        if (!obj.emailId) {
            this.#throwError("EmailId is must");
        }
        this.#validateEmail(obj.emailId);
        this.#emailId = obj.emailId;
        if (!obj.passkey) {
            this.#throwError("Passkey of the corresponding email must");
        }
        this.#validatePasskey(obj.passkey)
        this.#passkey = obj.passkey;
        this.#transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: obj.emailId,
                pass: obj.passkey,
            },
        });
    }

    sendMail(obj) {
        obj.transporter = this.#transporter;
        obj.from = this.#emailId;
        EventHandler.emit('prepare_data', obj);
    }
}

module.exports = { EmailService, EventHandler };