export default defineNuxtPlugin(() => {
    return {
        provide: {
            locally: {
                getItem(item:string) {
                    if (process.client) {
                        return localStorage.getItem(item)    
                    } else {
                        return ""
                    }
                },

                setItem(item:string, value:any) {
                    if (process.client) {
                        return localStorage.setItem(item, value)
                    }
                }
            }
        }
    }
})