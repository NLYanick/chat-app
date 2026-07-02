class FileType {
    static FILE = "file";
    static IMAGE = "image";
    static VIDEO = "video";
    static AUDIO = "audio";

    static ALL = [
        FileType.FILE,
        FileType.IMAGE,
        FileType.VIDEO,
        FileType.AUDIO
    ];

    static containsStatus(value) {
        return FileType.ALL.includes(value);
    }
}

module.exports = FileType;
