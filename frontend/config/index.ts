let API_URL = "";

if (process.env.API_URL) {
    API_URL = process.env.API_URL;
} else if (process.env.NEXT_PUBLIC_API_URL) {
    API_URL = process.env.NEXT_PUBLIC_API_URL;
}

export {API_URL};
