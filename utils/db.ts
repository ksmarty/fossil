import { customAlphabet, Database, nolookalikesSafe, dayjs } from "../dep.ts";

let fileDB: Database<File>;

interface File {
	/** File name */
	name: string;
	/** Folder name */
	folder: string;
	/** Query string used to delete file */
	did: string;
	/** Date object as an ISO String */
	exp?: number;
}

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

const addFile = ({
	folder,
	file,
	exp,
}: {
	folder: string;
	file: string;
	exp?: number;
}) => {
	const did = customAlphabet(nolookalikesSafe, 10)();
	fileDB.insertOne({
		name: file,
		folder,
		did,
		exp,
	});
	return did;
};

const delFile = ({ folder }: { folder: string }) => {
	fileDB.deleteOne({ folder });
};

const init = () => {
	fileDB = new Database<File>("databases/file.json");
};

export { init, addFile, getFile, getAllFiles, delFile, getExpiredFiles };
