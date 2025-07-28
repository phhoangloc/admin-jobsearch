import axios from "axios"

export type BodyType = {
    archive: string,
    archivePlus?: string
    id?: string,
    slug?: string,
    search?: string,
    category?: string,
    skip?: number,
    limit?: number,
    sort?: string,
    update?: number,
    censor?: boolean
}

export const ApiLogin = async (body: { username: string, password: string }) => {
    const result = await axios.post(process.env.api_url + "api/login", body, {
        withCredentials: true
    })
    return result.data
}

export const ApiSignup = async (body: { username: string, password: string, email: string }) => {
    const result = await axios.post(process.env.api_url + "api/signup", body, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return result.data
}
export const ApiItem = async ({ archive, search, id, slug, category, sort, skip, limit, censor }: BodyType) => {
    try {
        const result = await axios.get(process.env.api_url + "api/" +
            archive +
            "?search=" + `${search ? search : ""}` +
            "&id=" + `${id ? id : ""}` +
            "&slug=" + `${slug ? slug : ""}` +
            "&category=" + `${category ? category : ""}` +
            "&skip=" + `${skip ? skip : ""}` +
            "&sort=" + `${sort ? sort : ""}` +
            "&limit=" + `${limit ? limit : ""}` +
            "&censor=" + `${censor ? censor : ""}`
        )
        return result.data
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}
export const getAddress = async (pNo: string) => {
    const result = await axios.get("https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + pNo)
    return result.data
}