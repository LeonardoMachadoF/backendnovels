import { checkSchema } from "express-validator";

export const userValidator = checkSchema({
    name: {
        trim: true,
        isLength: {
            options: { min: 2 }
        },
        errorMessage: "Nome precisa ter pelo menos 2 caracteres"
    },
    surname: {
        trim: true,
        isLength: {
            options: { min: 2 }
        },
        errorMessage: "Nome precisa ter pelo menos 2 caracteres"
    },
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'E-Mail inválido'
    },
    password: {
        isLength: {
            options: { min: 8 }
        },
        errorMessage: 'Senha precisa ter pelo menos 8 caracteres',
    }
})

export const loginValidator = checkSchema({
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'E-Mail inválido'
    },
    password: {
        isLength: {
            options: { min: 8 }
        },
        errorMessage: 'Senha precisa ter pelo menos 8 caracteres',
    }
})

export const chapterValidator = checkSchema({
    volume: {
        trim: true,
        isLength: {
            options: { min: 1 }
        },
        errorMessage: 'Volume precisa estar preenchido!'
    },
    number: {
        trim: true,
        isLength: {
            options: { min: 1 }
        },
        errorMessage: 'Capitulo precisa estar preenchido!'
    },
    title: {
        trim: true,
        isLength: {
            options: { min: 1 }
        },
        errorMessage: 'Titúlo precisa estar preenchido!'
    },
    content: {
        trim: true,
        isLength: {
            options: { min: 1 }
        },
        errorMessage: 'Conteudo precisa estar preenchido!'
    },
    novel_id: {
        isLength: {
            options: { min: 1 }
        },
        errorMessage: 'Novel precisa estar preenchida!'
    }
})

export const novelValidator = checkSchema({
    title: {
        trim: true,
        isLength: {
            options: { min: 2 }
        }
    },
    description: {
        trim: true,
        isLength: {
            options: { min: 8 }
        }
    },
    country_id: {
        trim: true,
        isLength: {
            options: { min: 8 }
        }
    },
    category_id: {
        trim: true,
        isLength: {
            options: { min: 8 }
        }
    },
    artist_id: {
        trim: true,
        isLength: {
            options: { min: 8 }
        }
    },
    author_id: {
        trim: true,
        isLength: {
            options: { min: 8 }
        }
    }
})