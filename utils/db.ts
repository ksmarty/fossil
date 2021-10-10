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
	/** Permission level */
	level?: 0 | 1 | 2 | 3;
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

const getAllFiles = async (uploader?: string, level = 0) => {
	return level > 1
		? await fileDB.findMany()
		: await fileDB.findMany({ uploader });
};

const getExpiredFiles = async () => {
	return await fileDB.findMany((doc: File) =>
		doc?.exp ? dayjs().isAfter(dayjs(doc.exp)) : false
	);
};

const addFile = async (file: File) => {
	const did = customAlphabet(nolookalikesSafe, 10)();
	await fileDB.insertOne({
		...file,
		did,
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

const addUser = async (user: Auth) => {
	await authDB.insertOne(user);
};

const getPass = async (user: string) => {
	const acc = await authDB.findOne({ user });
	return acc?.pass;
};

const getLevelDB = async (user: string) => {
	const acc = await authDB.findOne({ user });
	return acc?.level;
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
	getLevelDB,
};
