import axios from "axios"


export type BodyTypeWithPosition = {
    position: string,
    archive?: string,
    part?: string,
    mondai?: string,
    id?: number,
    slug?: string,
    hostId?: string,
    search?: string,
    skip?: number,
    limit?: number,
    sort?: string,
    update?: number,
    file?: File,
    examinee?: number
}
export const ApiCheckLogin = async () => {
    try {
        const result = await axios.get(process.env.api_url + "api/user", {
            withCredentials: true
        })
        return (result.data)

    } catch (error) {
        console.log(error)
        return ({ success: false })
    }

}
export const ApiLogout = async ({ position }: BodyTypeWithPosition) => {
    const result = await axios.post(process.env.api_url + "api/" + position + "/logout", {}, {
        withCredentials: true
    })
    return result.data
}

export const ApiItemUser = async ({ position, archive, hostId, search, id, slug, sort, skip, limit, examinee }: BodyTypeWithPosition) => {
    try {
        const result = await axios.get(process.env.api_url + "api/" + position +
            "/" + archive +
            "?hostId=" + `${hostId ? hostId : ""}` +
            "&search=" + `${search ? search : ""}` +
            "&id=" + `${id ? id : ""}` +
            "&slug=" + `${slug ? slug : ""}` +
            "&skip=" + `${skip ? skip : ""}` +
            "&sort=" + `${sort ? sort : ""}` +
            "&limit=" + `${limit ? limit : ""}` +
            "&examinee=" + `${examinee ? examinee : ""}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        )
        return result.data
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

export const ApiCreateItem = async ({ position, archive }: BodyTypeWithPosition, body: unknown) => {
    const result = await axios.post(process.env.api_url + "api/" +
        position +
        "/" + archive,
        body,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
    return (result.data)
}
export const ApiUpdateItem = async ({ position, archive, id }: BodyTypeWithPosition, body: unknown) => {
    const result = await axios.put(process.env.api_url + "api/" +
        position +
        "/" + archive +
        "?id=" + id,
        body,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
    return (result.data)
}
export const ApiDeleteItem = async ({ position, archive, id }: BodyTypeWithPosition) => {
    const result = await axios.delete(process.env.api_url + "api/" +
        position +
        "/" + archive +
        "?id=" + id,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
    return (result.data)
}

export const ApiUploadFile = async ({ position, archive, file }: BodyTypeWithPosition) => {
    const formData = new FormData()
    if (file) {
        formData.append("file", file)
        const fileUpload = await axios.post(process.env.api_url + "api/" + position + "/" + archive, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',

            },
            withCredentials: true
        })
        return fileUpload.data
    }

}