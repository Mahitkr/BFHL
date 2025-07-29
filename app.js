const express = require("express");
const app = express();

app.use(express.json());

function isNumberString(s) {
  return typeof s === 'string' && /^[0-9]+$/.test(s);
}
function isAlphabetString(s) {
    return typeof s === "string" && /^[a-zA-Z]+$/.test(s);
}
function isSpecialCharacter(s) {
    return typeof s === "string" && !/^[a-zA-Z0-9]+$/.test(s);
}
function alternatingCaps(str) {
  let arr = str.split("").reverse();
  return arr.map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const { data, full_name, dob, email, roll_number } = req.body;

    // Validate required fields
    if (!Array.isArray(data) || !full_name || !dob || !email || !roll_number) {
      return res.status(400).json({
        is_success: false,
        message: "Missing required field(s): data, full_name, dob, email, roll_number"
      });
    }

    let odd_numbers = [];
    let even_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;
    let all_alpha_chars = [];

    for (let entry of data) {
      if (isNumberString(entry)) {
        let num = Number(entry);
        if (num % 2 === 0) {
          even_numbers.push(entry);
        }
        sum += num;
      } else if (isAlphabetString(entry)) {
        alphabets.push(entry.toUpperCase());
        for (let c of entry) {
          all_alpha_chars.push(c);
        }
      }
    }

    let concat_string = "";
    if (all_alpha_chars.length > 0) {
      concat_string = alternatingCaps(all_alpha_chars.join(""));
    }
    
    const user_id =
      full_name.trim().toLowerCase().replace(/\s+/g, "_") +
      "_" +
      dob;

    const response = {
      is_success: true,
      user_id,
      email,
      roll_number,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      is_success: false,
      message: err.message || "Internal Server Error"
    });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
}
