
export const convertArchive = (text: string) => {
    if (text === "news") {
        return "ニュース"
    }
    if (text === "file") {
        return "写真"
    }
    if (text === "user") {
        return "ユーザー"
    }
    if (text === "category") {
        return "カテゴリー"
    }
    if (text === "post") {
        return "求人情報"
    }
    if (text === "facility") {
        return "施設情報"
    }
    if (text === "interview") {
        return "インタビュー"
    }
    return text
}