import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreVehicles.css";
 
const categories = [
  { key: "all",     label: "All",     accent: "#e2e8f0" },
  { key: "sedan",   label: "Python",  accent: "#3b82f6" },
  { key: "suv",     label: "AI / ML", accent: "#a78bfa" },
  { key: "sports",  label: "SQL",     accent: "#f59e0b" },
  { key: "electric",label: "Java",    accent: "#ef4444" },
  { key: "html",    label: "Web Dev", accent: "#10b981" },
];
 
const carData = {
  sedan: [
    {
      title: "Python Fundamentals",
      desc: "Core programming concepts — variables, loops, functions & more.",
      lessons: "4 Lessons",
      tech: "Python",
      level: "Beginner",
      price: "₹999",
      offer: "₹499",
      accent: "#3b82f6",
      image: "https://i.pinimg.com/1200x/b7/1c/85/b71c8545c65ebfe61776d98723d7da31.jpg",
    },
    {
      title: "OOP in Python",
      desc: "Master classes, inheritance, polymorphism & design patterns.",
      lessons: "6 Lessons",
      tech: "Python",
      level: "Advanced",
      price: "₹999",
      offer: "₹699",
      accent: "#3b82f6",
      image: "https://i.pinimg.com/1200x/b7/1c/85/b71c8545c65ebfe61776d98723d7da31.jpg",
    },
  ],
  suv: [
    {
      title: "AI Fundamentals",
      desc: "Build an intuition for how modern AI systems actually work.",
      lessons: "4 Lessons",
      tech: "AI",
      level: "Beginner",
      price: "₹999",
      offer: "₹499",
      accent: "#a78bfa",
      image: "https://lh3.googleusercontent.com/rd-gg-dl/AOI_d__R6ck09pErfUvOr8qDuf7cNSLzrCV2DFUW8Z8nTVX-7pxq7Jb0HijV2xEpCbYATHNK0RZPF4_6eFM_ZmFBFGOKcUZD6P5OHh0QRSqXbIkJW_Mqxjn3AXKVtR9jlAsy4Qza_k19dYFdcfwtpXOkHtwWpL4-YJ5VdeSqUPr98cMhSeHWfXjMiwGEteMWprr2FiJBbXYYqrIiEdSBmmDAZiM7bHdT64xjhbE60GgfAuwYQX6asA1L8Mxoeu1D9so0ML9-kxAGRT7T8EQei8nF23ehl3JgBaYAe8h0qaDWYTslRJqz9Fi_lc2VCQ-5YlJAfgkFqk_VSwOycGaJ4jspokqeQ32IXh-OHmQWE5_Et8PdVtYIbRpQY1mEIINneXSpsJ5fi3786Js7BkvI8-vpoFFd4m26jOxF9JE1XSA4mVc7I0UdQa5sw8wMZxTVy0qJbryeP-YvUnRRRHwBlDUM1guy5H8y3vc5y6widu8od8CJXo22JWePP8NzKzZjlki31dNTwjrz-9cM3TGPZrOzOCryFFdnH94ntgsFkOKP3b5mA4nHbk8_W5GOavE22_s5OMvl8DJ8jbelRkQwNSYXTRfq-uZS7j8WlXDSGpXaw7x27Q_QmnQ8ZKCArYNTcjOtJcBdX8qlUBRtEm-NZwqDztRM_oC4LrRQZHL3CR0_PmpbF_Z4WaBwGA2kXtHzVxlwVAA4o41-DxtxcL6Y5UFl9Mgpp9l-pNX9uV13TarBV_DUV9QoSGODBOgPk20JYuR6re-ek64Bm0vYfNEzoLklW96xq66GSql7QZ99SSHkRgIr21lm-KVjPaVGG2wBhW67dlX2uIfyi2UJLyPVgPuw6XSw3F-5R_LrRQeM_8q6r0tNtIkkpZeK3re2Jt-LvFXagRcmXXPmprY_O7pQmh3ujTM-TfFesGQnKiso09CuI_dBaJDOC2N-XLutT_-wuaed_YDIacwQ6tzL8W9SWK01piNztWiL2B0SeLszJEOxuo3pFRe00Cb361nlBEHobFcKy3LT1fJRBua_A2eH8RPXFBmERV6tYtW2zztXTrXoJEu_LYBEez8Xa7YVUnj3QbMXPvfW5-KQcvXkMczhKDjLig2goUGKZVlgMdesjkOR57nDITMIifoTOFGZHqtKZHKrooPynrskUaHxfGHj_-9hDxBRRNnXIIcplb600hIAIG5iIRhCbGZoSJacoG4gUdjXtLtYBuJDz9YdB3fmJd7VWTZEdFa5vUO9T4eFGNfGo9l6cErNdl-6CXvUgqox3YQXHrJm_qeJTO_od5-yUmwL2rWkEZn8BlOPV1oGmSJMP0JnSoJpSumeKhjXF_ZI8nAx8Lctr3_DhT01OGkbmRmeIBRmkbXPd4NZVthI-6ClN5GHJnqmZtMhDo3QHvGS_b-QnKdGwA=s1024-rj",
    },
    {
      title: "Machine Learning",
      desc: "Supervised & unsupervised learning, models and evaluation.",
      lessons: "6 Lessons",
      tech: "AI",
      level: "Advanced",
      price: "₹1299",
      offer: "₹899",
      accent: "#a78bfa",
      image: "https://lh3.googleusercontent.com/rd-gg-dl/AOI_d__R6ck09pErfUvOr8qDuf7cNSLzrCV2DFUW8Z8nTVX-7pxq7Jb0HijV2xEpCbYATHNK0RZPF4_6eFM_ZmFBFGOKcUZD6P5OHh0QRSqXbIkJW_Mqxjn3AXKVtR9jlAsy4Qza_k19dYFdcfwtpXOkHtwWpL4-YJ5VdeSqUPr98cMhSeHWfXjMiwGEteMWprr2FiJBbXYYqrIiEdSBmmDAZiM7bHdT64xjhbE60GgfAuwYQX6asA1L8Mxoeu1D9so0ML9-kxAGRT7T8EQei8nF23ehl3JgBaYAe8h0qaDWYTslRJqz9Fi_lc2VCQ-5YlJAfgkFqk_VSwOycGaJ4jspokqeQ32IXh-OHmQWE5_Et8PdVtYIbRpQY1mEIINneXSpsJ5fi3786Js7BkvI8-vpoFFd4m26jOxF9JE1XSA4mVc7I0UdQa5sw8wMZxTVy0qJbryeP-YvUnRRRHwBlDUM1guy5H8y3vc5y6widu8od8CJXo22JWePP8NzKzZjlki31dNTwjrz-9cM3TGPZrOzOCryFFdnH94ntgsFkOKP3b5mA4nHbk8_W5GOavE22_s5OMvl8DJ8jbelRkQwNSYXTRfq-uZS7j8WlXDSGpXaw7x27Q_QmnQ8ZKCArYNTcjOtJcBdX8qlUBRtEm-NZwqDztRM_oC4LrRQZHL3CR0_PmpbF_Z4WaBwGA2kXtHzVxlwVAA4o41-DxtxcL6Y5UFl9Mgpp9l-pNX9uV13TarBV_DUV9QoSGODBOgPk20JYuR6re-ek64Bm0vYfNEzoLklW96xq66GSql7QZ99SSHkRgIr21lm-KVjPaVGG2wBhW67dlX2uIfyi2UJLyPVgPuw6XSw3F-5R_LrRQeM_8q6r0tNtIkkpZeK3re2Jt-LvFXagRcmXXPmprY_O7pQmh3ujTM-TfFesGQnKiso09CuI_dBaJDOC2N-XLutT_-wuaed_YDIacwQ6tzL8W9SWK01piNztWiL2B0SeLszJEOxuo3pFRe00Cb361nlBEHobFcKy3LT1fJRBua_A2eH8RPXFBmERV6tYtW2zztXTrXoJEu_LYBEez8Xa7YVUnj3QbMXPvfW5-KQcvXkMczhKDjLig2goUGKZVlgMdesjkOR57nDITMIifoTOFGZHqtKZHKrooPynrskUaHxfGHj_-9hDxBRRNnXIIcplb600hIAIG5iIRhCbGZoSJacoG4gUdjXtLtYBuJDz9YdB3fmJd7VWTZEdFa5vUO9T4eFGNfGo9l6cErNdl-6CXvUgqox3YQXHrJm_qeJTO_od5-yUmwL2rWkEZn8BlOPV1oGmSJMP0JnSoJpSumeKhjXF_ZI8nAx8Lctr3_DhT01OGkbmRmeIBRmkbXPd4NZVthI-6ClN5GHJnqmZtMhDo3QHvGS_b-QnKdGwA=s1024-rj",
    },
  ],
  sports: [
    {
      title: "SQL Fundamentals",
      desc: "Write your first queries, filters, and aggregations confidently.",
      lessons: "4 Lessons",
      tech: "SQL",
      level: "Beginner",
      price: "₹699",
      offer: "₹499",
      accent: "#f59e0b",
      image: "https://lh3.googleusercontent.com/rd-gg/AMW1TPpGyo6Y40a27eKbdsW4z6UrTRdGBVOKazN670GZUrzrMhQleesey8_61h6W0oPB0kSOABqcJVUGqTnxix1Lb-VwOsckehazYAtT8g0EUdLWrTRMWjNso9WUi5wRJRlpkXt5BW1rR2kdgxukTmXDQaryT4rYqCvGb1DFfl7QcgM6-row57ZfPhDTMTM4kWrQtxXnQM_to7dHMNBg0Z3u9cMJVokRt5SMiHrpAlRTUoVxY0MERD2ohryS4EuXyoJqdXIFGUZ0hcEJXCpkj1BevboCKKF7irOzVHVULC2WhQg1RzgHcRr2xkpdHb0rtn-qu7rHTKHFNm4b2wVAY3dlobU9WdfIte4PRdZlUkSGutVw4KWRF31Y3pihJzoGBwnLvN6kaGzSJAO1xP9QVj96qi86eY8M9AUV_uR3k3wpV_45GXmVJ_8DQ1BDhcyg6wR7jl_0agf94coKJbhW9jFSRcYgzHx_FR0Z-zMojrouCI3EiL85-oMITegeduiXH7y97bI3_C7IrCUt_mx8FL0bic0C-bhrV0xKp4H8JBWCU8AFFc3B2ZQ5idkYc2beXRBQlk1biiRxlP7K-PHrHSZo_PFAvOfTOUVJlciv1jzH4a7EbgGIpTTJpXZ-_ShGWFhVjDuWfzMLt8QSEgVHeK2FDkO3PFEt5jPvwbqIB8Ldx2Vnsv3WWRcGta3V4n5aL12pQWt4EQP1Rtyt8XVS8bXcUj8kB2fEe2h7u7L4LEtnMRbxjt8nUeCqhxX-MnO_wyhObltCjTzytKb9kNiV0P4Hwj6Ch2zcl5PtocOl68ujc5NBiJozjd9Hdey6gb0DRwQKv3SyYnau15MiuSohNM96thzoJkI7OzxgYNWiWtLln9oJlA9G7BuStLE5xV32nzsIB9Gqz2y3Eyq538_NAc8mD5J5u8NF1cGm_X5zosTlk0xA48mALorle3lYw5cngN7K2qbslbv7Y5dO_DtgJgJbjuQaDfcNKKtl6_TeNgC1tWDsUnHyXMu1abYOR5ZAsp16hjqtG1v8i4Ips2ZAgAZIkQ5wRhtY6eisKGJbNaQczkdF8H61OUU6f8tNfnEvW24fgC7LaooONzvRLELFiATJRsspn4fz6lQO82g6leDsbO1Ex9WKkDAgia15pCBOiN6xQ2HZx7PMHcMIqiOyHRP7Rykjkrlzy-QqT-rgRyUC4knCEGqgiB9rSnH6tAWFOwcYhU3O4feH_Jd4FpdRq3m54Q9o8nQbqu8S8GhV5gOGqxeutbIfyOQ7ReqepFfOFb1FkYIAe3HLb5JzvwxYPGJceGrqBf1vhKfiyhzb6rokVjVW4HUSKy-esE1P-LEKX6Ax3mz41x6RQNkgqNGhW6jCZFM61U1YlaOZPyHnZRYxE8i7nnCDjnpAl229uaGQffVUtaQ4zkMnd6humsITLll6GmzlONGX8Q2FB9-r4DBQDgcUg3EJFpBZx15vrKazyVs1G2-2k05MPMG5wGq7wppTnGG9vsSNU4UQ9nnOBfw5ficLstep7JiZu_j9p3dYVaajI6Jj9vTw0sdX09W6EN5WGY4hukErB5jWzJl0=s1024-rj",
    },
    {
      title: "Queries & Joins",
      desc: "Complex JOINs, subqueries, indexes, and performance tuning.",
      lessons: "6 Lessons",
      tech: "SQL",
      level: "Advanced",
      price: "₹999",
      offer: "₹699",
      accent: "#f59e0b",
      image: "https://lh3.googleusercontent.com/rd-gg/AMW1TPpGyo6Y40a27eKbdsW4z6UrTRdGBVOKazN670GZUrzrMhQleesey8_61h6W0oPB0kSOABqcJVUGqTnxix1Lb-VwOsckehazYAtT8g0EUdLWrTRMWjNso9WUi5wRJRlpkXt5BW1rR2kdgxukTmXDQaryT4rYqCvGb1DFfl7QcgM6-row57ZfPhDTMTM4kWrQtxXnQM_to7dHMNBg0Z3u9cMJVokRt5SMiHrpAlRTUoVxY0MERD2ohryS4EuXyoJqdXIFGUZ0hcEJXCpkj1BevboCKKF7irOzVHVULC2WhQg1RzgHcRr2xkpdHb0rtn-qu7rHTKHFNm4b2wVAY3dlobU9WdfIte4PRdZlUkSGutVw4KWRF31Y3pihJzoGBwnLvN6kaGzSJAO1xP9QVj96qi86eY8M9AUV_uR3k3wpV_45GXmVJ_8DQ1BDhcyg6wR7jl_0agf94coKJbhW9jFSRcYgzHx_FR0Z-zMojrouCI3EiL85-oMITegeduiXH7y97bI3_C7IrCUt_mx8FL0bic0C-bhrV0xKp4H8JBWCU8AFFc3B2ZQ5idkYc2beXRBQlk1biiRxlP7K-PHrHSZo_PFAvOfTOUVJlciv1jzH4a7EbgGIpTTJpXZ-_ShGWFhVjDuWfzMLt8QSEgVHeK2FDkO3PFEt5jPvwbqIB8Ldx2Vnsv3WWRcGta3V4n5aL12pQWt4EQP1Rtyt8XVS8bXcUj8kB2fEe2h7u7L4LEtnMRbxjt8nUeCqhxX-MnO_wyhObltCjTzytKb9kNiV0P4Hwj6Ch2zcl5PtocOl68ujc5NBiJozjd9Hdey6gb0DRwQKv3SyYnau15MiuSohNM96thzoJkI7OzxgYNWiWtLln9oJlA9G7BuStLE5xV32nzsIB9Gqz2y3Eyq538_NAc8mD5J5u8NF1cGm_X5zosTlk0xA48mALorle3lYw5cngN7K2qbslbv7Y5dO_DtgJgJbjuQaDfcNKKtl6_TeNgC1tWDsUnHyXMu1abYOR5ZAsp16hjqtG1v8i4Ips2ZAgAZIkQ5wRhtY6eisKGJbNaQczkdF8H61OUU6f8tNfnEvW24fgC7LaooONzvRLELFiATJRsspn4fz6lQO82g6leDsbO1Ex9WKkDAgia15pCBOiN6xQ2HZx7PMHcMIqiOyHRP7Rykjkrlzy-QqT-rgRyUC4knCEGqgiB9rSnH6tAWFOwcYhU3O4feH_Jd4FpdRq3m54Q9o8nQbqu8S8GhV5gOGqxeutbIfyOQ7ReqepFfOFb1FkYIAe3HLb5JzvwxYPGJceGrqBf1vhKfiyhzb6rokVjVW4HUSKy-esE1P-LEKX6Ax3mz41x6RQNkgqNGhW6jCZFM61U1YlaOZPyHnZRYxE8i7nnCDjnpAl229uaGQffVUtaQ4zkMnd6humsITLll6GmzlONGX8Q2FB9-r4DBQDgcUg3EJFpBZx15vrKazyVs1G2-2k05MPMG5wGq7wppTnGG9vsSNU4UQ9nnOBfw5ficLstep7JiZu_j9p3dYVaajI6Jj9vTw0sdX09W6EN5WGY4hukErB5jWzJl0=s1024-rj",
    },
  ],
  electric: [
    {
      title: "Java Fundamentals",
      desc: "Strong-typed Java — syntax, control flow and core APIs.",
      lessons: "4 Lessons",
      tech: "Java",
      level: "Beginner",
      price: "₹799",
      offer: "₹399",
      accent: "#ef4444",
      image: "https://lh3.googleusercontent.com/rd-gg-dl/AOI_d_9CcjyTrRD_6oMHzXIGtt3z_pebr6pRKSPH87Gj92LXMuCXpeKZQ78FX5a24bCnR84JKxUm7noxHFNspcwbQ8Q4ijKbvw19Kk4Ew-A36WMG3h_YYYerjRTxTxiWF_VuaS-r-CN7b0WCz9T7SKmAzezMD_yLjL-xi_7rqh5p4gXWqhfrI3i_ZyjYDSO_5l2f3DiAlaNNqrby39N2hCBW7MiRgGi7-6UdFKD8C6u9U2Jw1jekUuLJFx3JgLFE_UpJ9-JCaDtJqh8_gJBnshROA16HAWIMJGX1YyL6LuEI6hPaz8QQ-L4u8-vZKSvUV8KmD151pbyzp4_qZxulZMqU6mwCqDu0_csgVAUXRKjCqZpQWvbKO1laesCs_TDf8BSWfL1-zNynhDEa5i5MAXzhN1goAgq580ggQiBZ7Ds2zXovrSarM_BZ9Y8X1-gall9FsV8iJ6tfYYfEJ2fbCnLOeXg7CUuB6GIo34jlEzvhH7W4sXwUCVq021sWHHhQg3LQrs7ivUGTN6rf_3hgPMejEHtrbLLCrRgzbzFOtDvnQa1jEN1PnanO0wK8qEBvU2-OWuNXjCOd1Xr5M7IPqMJCzokYX8G1Lk6gpwIrmlRa6xSClTyECnTdbkT7N2FDDl5V15IpM50-fhxUlLeppuiHKk_9uD5GuZdv3JlWazt70rkSCIb7kuLRpzse6ru4gvltFVMdw2qtfmwauZeAL4PnPpAG35k7v8SvTlb0yQHBul9Z48Y9ZZcarDuPpn33QhbrIrrj-dbfZv1lgb_xW8VAOKzbCITGeVZns2sQxDltCxN9M5uhH3QF1PG41KBW1Y-6ZeaFWTBOXsLn2ibF6ScDIHGH2LMzt7I2AloIH2Zs8xZw5wmoP1iAheV7-jEme2DEzspTVPvZr5Q6Hkhx6rVWLgQfMtpqxQCWYR-qQjSx8xUbCEmIzdnH6ZPPVQUSDmvwxJMe2aAOGo7nl0H2ndhqElW97mXiqVfWeyDz_9PKLqOV6A9crk7-I3jEQU1MmRpuhM0MdpaApfncygE-EbqK0Tzp4AxnQKd6ooZeSB4B7eKqBEMXjUruxkCSw1llhHLrn-uESksgWgMGxjK0d5YDALY2nrXLVJisFZUOVMi4QLlMwJmt0j-oP_3KZsB461IMKJaHSf26DCkjmhIHTtLAsL_IBd_lJhDbNd9sRvtUpvjpGeIryeVEUikGyGPlMFUkNDQyKkhDXbjhuXvs_6rDFvz4XLw82LUTbH6Hu4aMJmyyv3QsFQvGgh9A4ubyUiz1L-li1kI-61SrDKcW492-FL_8B6Cb3PECS78_JcrFGtGJyqhSFlYqArba7-V98EkYxQfvWLO_pmrDydQ_t4UBFM4D38P_Hm-fK3wB-HqE0-_bMX5P55LVa7hiYjgTN8eVwyzxIw=s1024-rj",
    },
    {
      title: "OOP in Java",
      desc: "Interfaces, abstract classes, collections & exception handling.",
      lessons: "6 Lessons",
      tech: "Java",
      level: "Advanced",
      price: "₹999",
      offer: "₹699",
      accent: "#ef4444",
      image: "https://lh3.googleusercontent.com/rd-gg-dl/AOI_d_9CcjyTrRD_6oMHzXIGtt3z_pebr6pRKSPH87Gj92LXMuCXpeKZQ78FX5a24bCnR84JKxUm7noxHFNspcwbQ8Q4ijKbvw19Kk4Ew-A36WMG3h_YYYerjRTxTxiWF_VuaS-r-CN7b0WCz9T7SKmAzezMD_yLjL-xi_7rqh5p4gXWqhfrI3i_ZyjYDSO_5l2f3DiAlaNNqrby39N2hCBW7MiRgGi7-6UdFKD8C6u9U2Jw1jekUuLJFx3JgLFE_UpJ9-JCaDtJqh8_gJBnshROA16HAWIMJGX1YyL6LuEI6hPaz8QQ-L4u8-vZKSvUV8KmD151pbyzp4_qZxulZMqU6mwCqDu0_csgVAUXRKjCqZpQWvbKO1laesCs_TDf8BSWfL1-zNynhDEa5i5MAXzhN1goAgq580ggQiBZ7Ds2zXovrSarM_BZ9Y8X1-gall9FsV8iJ6tfYYfEJ2fbCnLOeXg7CUuB6GIo34jlEzvhH7W4sXwUCVq021sWHHhQg3LQrs7ivUGTN6rf_3hgPMejEHtrbLLCrRgzbzFOtDvnQa1jEN1PnanO0wK8qEBvU2-OWuNXjCOd1Xr5M7IPqMJCzokYX8G1Lk6gpwIrmlRa6xSClTyECnTdbkT7N2FDDl5V15IpM50-fhxUlLeppuiHKk_9uD5GuZdv3JlWazt70rkSCIb7kuLRpzse6ru4gvltFVMdw2qtfmwauZeAL4PnPpAG35k7v8SvTlb0yQHBul9Z48Y9ZZcarDuPpn33QhbrIrrj-dbfZv1lgb_xW8VAOKzbCITGeVZns2sQxDltCxN9M5uhH3QF1PG41KBW1Y-6ZeaFWTBOXsLn2ibF6ScDIHGH2LMzt7I2AloIH2Zs8xZw5wmoP1iAheV7-jEme2DEzspTVPvZr5Q6Hkhx6rVWLgQfMtpqxQCWYR-qQjSx8xUbCEmIzdnH6ZPPVQUSDmvwxJMe2aAOGo7nl0H2ndhqElW97mXiqVfWeyDz_9PKLqOV6A9crk7-I3jEQU1MmRpuhM0MdpaApfncygE-EbqK0Tzp4AxnQKd6ooZeSB4B7eKqBEMXjUruxkCSw1llhHLrn-uESksgWgMGxjK0d5YDALY2nrXLVJisFZUOVMi4QLlMwJmt0j-oP_3KZsB461IMKJaHSf26DCkjmhIHTtLAsL_IBd_lJhDbNd9sRvtUpvjpGeIryeVEUikGyGPlMFUkNDQyKkhDXbjhuXvs_6rDFvz4XLw82LUTbH6Hu4aMJmyyv3QsFQvGgh9A4ubyUiz1L-li1kI-61SrDKcW492-FL_8B6Cb3PECS78_JcrFGtGJyqhSFlYqArba7-V98EkYxQfvWLO_pmrDydQ_t4UBFM4D38P_Hm-fK3wB-HqE0-_bMX5P55LVa7hiYjgTN8eVwyzxIw=s1024-rj",
    },
  ],
  html: [
    {
      title: "HTML Fundamentals",
      desc: "Semantic markup, accessibility and document structure.",
      lessons: "4 Lessons",
      tech: "HTML + CSS",
      level: "Beginner",
      price: "₹599",
      offer: "₹299",
      accent: "#10b981",
      image: "https://lh3.googleusercontent.com/rd-gg-dl/AOI_d__wm4Qso-eguk6FNUkzP5L81bNCRYrtBXNlff_49u9VoNOBAQt-6IezCJldEBUBYP-hS2F8e3uHj0RFUgctouJrnd_FA3PkCcNRZ27tVoGuLOXpUa8UYUrlqRdcsoTWqYbh3leMOaKvgOdCN7F9JKL-OZczA0phqnGVdIoHtNPWrykwxp5gcrEuqMbWQEmxDW-cGVY_rKxZ8Wo2FrAH7QGm371c_wkeJdABY7fT2z7cFJDbig_lHmXIQ3vNT7Kc8XK5Sjd4vKG6bkwoa8Q5iANRGmyFKr-8lDw0bYjOlW4Vsl5xkDBtmZ9UtYCM3Dh7rYFzR0mXctvhh-BaqboKE-zbpeyQR3wCFWYNh4eP5kG7rGoHMrWrQo3q4q6UHJ5x6HWS-9Sn5q2OJnZ_GW239RCIrLkfUGgZcgXvCK9FBEYZ6fQnImFdZzVjHHDMpplQvI0QSJEuPnm6A3Q_FlK1bb70PVsP7-iheKdmyu6frmj4cGN_RweRpZj2T7oS4h36VSrucxmDlLA4randhBLl8p9MWFcWODypALgiY3HZZspZBMERLjoCYBVZGB3rAmKidASBP6IU-BqpsHLNfQ2fYsPH8zkc_DaTyH4hbb2RtldD0XB9rabYa5Y0iwBReUA_hYuSxxqR6ozcD_GGXJ5VENFeAsbRADPHwDY5G698kIOcz8lAvr6-2mgQf9ZpWJcxhZKQ2AJ3n8qhWW2BImnSXrj_xIeKNz73re_cBdTkbrPq32ASzoHTpC81DkPtjy-1o5E6RBKKrJAma0sMXIVIYKlfzBtBESHJjngAh6nbq9JUlOEicXtB92eCLc9WKwd61EcXCLMQBXbwQwHZewi21Gi993ZVrNjZN1uByhxh6xT9AewLW03i9tjITrbeymqdLeTcgDoac3jlrFdHq1P5JR_TVbU2agAUcgX5lyTNR2hdz-DhgpSYaLn1FXUxgd2x3naJS1Nzjg3ZUbnyEliLKKSd6qY-H9VzgRdbIhp4RM3S3ICAPVKLc_hwlcnVDfmonx-KFGX1zp_bZaiCYgB_f-7KSQXG9GNu5V1nWQXX8HPkJGgu4UM5s_-EZ-SOxaJh3cwt0MyqS67HcOjgbz-pXeM1OGO3zNEsDPuxobncMjqYrY-g6kWzEXbQ7cRk3NgQzmkFLYVYNnM5H0SYagFYUCFiAR5Wfp39xepChamU4dKN86oLcAsVGa9YErWkpC0prPpUZUdrcWw2zZQf0ptaSVm6YL2hsWWweBOw7bDwjfvnukvGGGqMjuygjeBQRbkzKAuIFAnXPQyGzEqXa4yPzPAO_Rk3_CpWftd12oi-aexsq2QLkH2LwwqmgjlS3VSUHa-_l8okad7gAOBOSPXD5pzvWrdx6lK6I_OrIWKyBTJhlUrjbSB9cHxPExCdp-PYgkwr=s1024-rj",
    },
    {
      title: "CSS Styling",
      desc: "Flexbox, Grid, animations and responsive design mastery.",
      lessons: "6 Lessons",
      tech: "HTML + CSS",
      level: "Advanced",
      price: "₹699",
      offer: "₹399",
      accent: "#10b981",
      image: "https://lh3.googleusercontent.com/rd-gg-dl/AOI_d__wm4Qso-eguk6FNUkzP5L81bNCRYrtBXNlff_49u9VoNOBAQt-6IezCJldEBUBYP-hS2F8e3uHj0RFUgctouJrnd_FA3PkCcNRZ27tVoGuLOXpUa8UYUrlqRdcsoTWqYbh3leMOaKvgOdCN7F9JKL-OZczA0phqnGVdIoHtNPWrykwxp5gcrEuqMbWQEmxDW-cGVY_rKxZ8Wo2FrAH7QGm371c_wkeJdABY7fT2z7cFJDbig_lHmXIQ3vNT7Kc8XK5Sjd4vKG6bkwoa8Q5iANRGmyFKr-8lDw0bYjOlW4Vsl5xkDBtmZ9UtYCM3Dh7rYFzR0mXctvhh-BaqboKE-zbpeyQR3wCFWYNh4eP5kG7rGoHMrWrQo3q4q6UHJ5x6HWS-9Sn5q2OJnZ_GW239RCIrLkfUGgZcgXvCK9FBEYZ6fQnImFdZzVjHHDMpplQvI0QSJEuPnm6A3Q_FlK1bb70PVsP7-iheKdmyu6frmj4cGN_RweRpZj2T7oS4h36VSrucxmDlLA4randhBLl8p9MWFcWODypALgiY3HZZspZBMERLjoCYBVZGB3rAmKidASBP6IU-BqpsHLNfQ2fYsPH8zkc_DaTyH4hbb2RtldD0XB9rabYa5Y0iwBReUA_hYuSxxqR6ozcD_GGXJ5VENFeAsbRADPHwDY5G698kIOcz8lAvr6-2mgQf9ZpWJcxhZKQ2AJ3n8qhWW2BImnSXrj_xIeKNz73re_cBdTkbrPq32ASzoHTpC81DkPtjy-1o5E6RBKKrJAma0sMXIVIYKlfzBtBESHJjngAh6nbq9JUlOEicXtB92eCLc9WKwd61EcXCLMQBXbwQwHZewi21Gi993ZVrNjZN1uByhxh6xT9AewLW03i9tjITrbeymqdLeTcgDoac3jlrFdHq1P5JR_TVbU2agAUcgX5lyTNR2hdz-DhgpSYaLn1FXUxgd2x3naJS1Nzjg3ZUbnyEliLKKSd6qY-H9VzgRdbIhp4RM3S3ICAPVKLc_hwlcnVDfmonx-KFGX1zp_bZaiCYgB_f-7KSQXG9GNu5V1nWQXX8HPkJGgu4UM5s_-EZ-SOxaJh3cwt0MyqS67HcOjgbz-pXeM1OGO3zNEsDPuxobncMjqYrY-g6kWzEXbQ7cRk3NgQzmkFLYVYNnM5H0SYagFYUCFiAR5Wfp39xepChamU4dKN86oLcAsVGa9YErWkpC0prPpUZUdrcWw2zZQf0ptaSVm6YL2hsWWweBOw7bDwjfvnukvGGGqMjuygjeBQRbkzKAuIFAnXPQyGzEqXa4yPzPAO_Rk3_CpWftd12oi-aexsq2QLkH2LwwqmgjlS3VSUHa-_l8okad7gAOBOSPXD5pzvWrdx6lK6I_OrIWKyBTJhlUrjbSB9cHxPExCdp-PYgkwr=s1024-rj",
    },
  ],
};
 
const levelIcon = { Beginner: "◈", Advanced: "◆" };
 
const CourseCard = ({ car, index, onView }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
 
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
 
  return (
    <article
      ref={ref}
      className={`ev-card ${visible ? "ev-card-visible" : ""}`}
      style={{ "--accent": car.accent, "--delay": `${index * 0.07}s` }}
    >
      {/* image */}
      <div className="ev-card-img-wrap">
        <img src={car.image} alt={car.title} className="ev-card-img" loading="lazy" />
        <div className="ev-card-img-overlay" />
        <span className="ev-tech-badge" style={{ background: car.accent }}>{car.tech}</span>
        <span className={`ev-level-badge ev-level-${car.level.toLowerCase()}`}>
          {levelIcon[car.level]} {car.level}
        </span>
      </div>
 
      {/* body */}
      <div className="ev-card-body">
        <h3 className="ev-card-title">{car.title}</h3>
        <p className="ev-card-desc">{car.desc}</p>
 
        <div className="ev-card-meta">
          <span className="ev-meta-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {car.lessons}
          </span>
          <span className="ev-meta-pill ev-meta-level">{car.level}</span>
        </div>
 
        <div className="ev-card-footer">
          <div className="ev-price-block">
            <span className="ev-price-old">{car.price}</span>
            <span className="ev-price-new" style={{ color: car.accent }}>{car.offer}</span>
          </div>
          <button className="ev-view-btn" onClick={() => onView(car)}>
            Details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
 
      {/* accent line at bottom */}
      <div className="ev-card-bar" style={{ background: car.accent }} />
    </article>
  );
};
 
const ExploreVehicles = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [selected, setSelected]   = useState(null);
  const [animKey, setAnimKey]     = useState(0);
 
  const allCars = Object.values(carData).flat();
  const vehicles = category === "all" ? allCars : (carData[category] || []);
 
  const switchCategory = (key) => {
    setCategory(key);
    setAnimKey(k => k + 1);
  };
 
  const handleView = (car) => setSelected(car);
  const closeModal = () => setSelected(null);
 
  const discount = (car) => {
    const orig = parseInt(car.price.replace(/[^\d]/g, ""));
    const off  = parseInt(car.offer.replace(/[^\d]/g, ""));
    return Math.round(((orig - off) / orig) * 100);
  };
 
  return (
    <section className="ev-root" id="inventory">
 
      {/* ── header ── */}
      <div className="ev-header">
        <p className="ev-header-eyebrow">What We Offer</p>
        <h2 className="ev-header-title">
          Explore <span className="ev-header-highlight">All Courses</span>
        </h2>
        <p className="ev-header-sub">
          Carefully crafted tracks — from first line of code to job-ready skills.
        </p>
      </div>
 
      {/* ── filter tabs ── */}
      <div className="ev-filters">
        {categories.map((c) => (
          <button
            key={c.key}
            className={`ev-filter-btn ${category === c.key ? "ev-filter-active" : ""}`}
            style={category === c.key ? { borderColor: c.accent, color: c.accent } : {}}
            onClick={() => switchCategory(c.key)}
          >
            {c.label}
            {category === c.key && (
              <span className="ev-filter-dot" style={{ background: c.accent }} />
            )}
          </button>
        ))}
      </div>
 
      {/* ── count ── */}
      <p className="ev-count">
        Showing <strong>{vehicles.length}</strong> course{vehicles.length !== 1 ? "s" : ""}
      </p>
 
      {/* ── grid ── */}
      <div className="ev-grid" key={animKey}>
        {vehicles.map((car, i) => (
          <CourseCard key={`${car.title}-${i}`} car={car} index={i} onView={handleView} />
        ))}
      </div>
 
      {/* ── modal ── */}
      {selected && (
        <div className="ev-modal-overlay" onClick={closeModal}>
          <div
            className="ev-modal"
            style={{ "--m-accent": selected.accent }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button className="ev-modal-close" onClick={closeModal}>✕</button>
 
            {/* image hero */}
            <div className="ev-modal-img-wrap">
              <img src={selected.image} alt={selected.title} className="ev-modal-img" />
              <div className="ev-modal-img-gradient" style={{ "--m-accent": selected.accent }} />
              <div className="ev-modal-img-content">
                <span className="ev-modal-tech" style={{ background: selected.accent }}>
                  {selected.tech}
                </span>
                <h2 className="ev-modal-title">{selected.title}</h2>
              </div>
            </div>
 
            {/* body */}
            <div className="ev-modal-body">
              <p className="ev-modal-desc">{selected.desc}</p>
 
              <div className="ev-modal-stats">
                <div className="ev-modal-stat">
                  <span className="ev-modal-stat-val" style={{ color: selected.accent }}>
                    {selected.lessons}
                  </span>
                  <span className="ev-modal-stat-key">Duration</span>
                </div>
                <div className="ev-modal-stat-sep" />
                <div className="ev-modal-stat">
                  <span className="ev-modal-stat-val" style={{ color: selected.accent }}>
                    {selected.level}
                  </span>
                  <span className="ev-modal-stat-key">Level</span>
                </div>
                <div className="ev-modal-stat-sep" />
                <div className="ev-modal-stat">
                  <span className="ev-modal-stat-val" style={{ color: selected.accent }}>
                    {discount(selected)}% OFF
                  </span>
                  <span className="ev-modal-stat-key">Discount</span>
                </div>
              </div>
 
              <div className="ev-modal-price-row">
                <div>
                  <span className="ev-modal-price-old">{selected.price}</span>
                  <span className="ev-modal-price-new" style={{ color: selected.accent }}>
                    {selected.offer}
                  </span>
                </div>
                <button
                  className="ev-modal-enroll"
                  style={{ background: selected.accent }}
                  onClick={() => navigate("/test-drive", { state: { car: selected } })}
                >
                  Enroll Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
 
export default ExploreVehicles;