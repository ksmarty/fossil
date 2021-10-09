import { customAlphabet, Database, nolookalikesSafe, dayjs } from "../dep.ts";

let fileDB: Database<File>;
let authDB: Database<Auth>;

interface File {
	/** File name */
	file: string;
	/** Folder name */
	folder: string;
	/** Query string used to delete file */
	did?: string;
	/** Date object as an ISO String */
	exp?: number;
	/** The user who uploaded the file */
	uploader?: string;
}

export interface Auth {
	/** Username */
	user: string;
	/** Hashed password */
	pass: string;
}

/***********************************************
 * Files Functions
 ***********************************************/

const initFiles = () => {
	fileDB = new Database<File>("databases/file.json");
};

const getFile = async ({ folder }: { folder: string }) => {
	return await fileDB.findOne({ folder });
};

const getAllFiles = async () => {
	return await fileDB.findMany();
};

const getExpiredFiles = async () => {
	return await fileDB.findMany((doc: File) =>
		doc?.exp ? dayjs().isAfter(dayjs(doc.exp)) : false
	);
};

const addFile = async ({ folder, file, exp, uploader }: File) => {
	const did = customAlphabet(nolookalikesSafe, 10)();
	await fileDB.insertOne({
		file,
		folder,
		did,
		exp,
		uploader,
	});
	return did;
};

const delFile = async ({ folder }: { folder: string }) => {
	await fileDB.deleteOne({ folder });
};

/***********************************************
 * Auth Functions
 ***********************************************/

const initAuth = () => {
	authDB = new Database<Auth>("databases/auth.json");
};

const addUser = async ({ user, pass }: Auth) => {
	await authDB.insertOne({ user, pass });
};

const getPass = async (user: string) => {
	const acc = await authDB.findOne({ user });
	return acc?.pass;
};

/***********************************************
 * Exports
 ***********************************************/

export {
	initFiles,
	addFile,
	getFile,
	getAllFiles,
	delFile,
	getExpiredFiles,
	initAuth,
	addUser,
	getPass,
};
