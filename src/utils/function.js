import axios from 'axios'
import CryptoJS from "crypto-js"
// var desKey = "6f726c64f2c2057" // 密钥
// var desIv = "0123456789ABCDEF" // 初始向量

export const BASE_URL = process.env.NODE_ENV === 'production' ? window.location.origin : VUE_APP_URL
// export const BASE_URL = process.env.NODE_ENV === 'production' ? window.location.origin : "http://47.95.117.10:8080"
let includeID = []

export const desDecrypt = () => {
    const key = CryptoJS.enc.Utf8.parse(desKey);
    const iv = CryptoJS.enc.Utf8.parse(desIv);
    let encryptBase64 = VUE_APP_GENOM_ID;
    let encrypted = CryptoJS.enc.Base64.parse(encryptBase64);
    let decrypted = CryptoJS.DES.decrypt({
        ciphertext: encrypted
    }, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}


includeID = desDecrypt().split(",")



export const http = (type, url, data, success, error) => {

    let config = {
        method: type,
        url: BASE_URL + url,
        withCredentials: true,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token") || "",
            'Content-Type': "application/json; charset=utf-8"
        }
    }



    if (type === 'post' || type === 'put') {
        config.data = (data)
    } else if (type === 'delete' || type === 'patch') {
        config.data = data
    } else if (type === 'get') {
        config.params = data
    }
    axios(config).then((response) => {
        const data = response.data.data
        const code = response.data.code
        const message = response.data.msg || ''
        let count = data.count
        if (code == 200 && data != '') {
            typeof success === 'function' && success(data)
        } else {
            typeof error === 'function' && error(message)
        }

        // if (code === 200) {
        //     typeof success === 'function' && success(data)
        // } else if (code === 4030) {

        // } else if (code === 402) { } else if (code === 600) { } else {
        //     typeof error === 'function' && error(message)
        // }
    }).catch(function (err) {
        console.log(err)
        typeof error === 'function' && error(message)
    })
}

/**
 * 发送post请求
 * @param url
 * @param params
 * @param success
 * @param error
 */
export const post = (url, params, success, error) => {
    // let pro_id = sessionStorage.getItem('pro_id')
    // params.pro_id = pro_id * 1
    // if (params.organism_id && includeID.includes(params.organism_id)) {
    http('post', url, params, success, error)

    // }

}

export const get = (url, params, success, error) => {
    // console.log(url, "urlurlurl");
    http('get', url, { pro_id: sessionStorage.getItem('pro_id') * 1, ...params }, success, error)
}
export const delet = (url, params, success, error) => {
    http('delete', url, params, success, error)
}
export const update = (url, params, success, error) => {
    http('patch', url, params, success, error)
}

export const put = (url, params, success, error) => {
    http('put', url, params, success, error)
}