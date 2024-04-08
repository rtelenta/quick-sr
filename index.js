import axios from "axios";
import mysql from "mysql";
import "dotenv/config";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const getOutcomes = async () => {
    const response = await axios.get(process.env.API_URL);

    return {
        id: response?.data?.data?.id,
        number: response?.data?.data?.result?.outcome?.number,
    };
};

const insertOutcome = (outcome) => {
    connection.query(
        `INSERT INTO numbers (id, number) VALUES ("${outcome.id}", ${outcome.number})`,
        function (err) {
            if (err) return;

            console.log(`id:${outcome.id} - number:${outcome.number} inserted`);
        }
    );
};

const addOutcome = async () => {
    const outcome = await getOutcomes();
    insertOutcome(outcome);
};

const init = () => {
    connection.connect(async function (err) {
        if (err) throw err;
        console.log("starting...");

        addOutcome();
        setInterval(() => {
            addOutcome();
        }, 20 * 1000);
    });
};

init();
