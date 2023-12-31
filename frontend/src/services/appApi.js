import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react';


//define a service using baseurl


const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000',
    }),

    endpoints: (builder) =>({

    signupUser: builder.mutation({
        query: (user)=>({
            url:'/users',
            method:"POST",
            body: user
        }),
    }),

    //login

    loginUser:builder.mutation({
        query: (user)=>({
            url: "/users/login",
            method: "POST",
            body: user,
        }),
    }),

    // logout user

    logoutUser: builder.mutation({
        query:(payload)=>({
            url: "/logout",
            method:"DELETE",
            body:payload,

        }),
    }),



    }),
});


export const {useSignupUserMutation,useLoginUserMutation,useLogoutUserMutation} = appApi;

export default appApi;