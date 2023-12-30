import  {db} from "../db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {config}  from "../config/auth.config.js"

export const addLesson=(req,res)=>{
    
    const q="Select * From ders Where ders_kodu = ?"
    var randomColor = getRandomColor();
    db.query(q,[req.body.dersKodu], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(409).json("Bu ders zaten eklenmiş");
        })

    const q2=`INSERT INTO Ders (ders_adi, ders_kodu, kontenjan, hoca_id, sinif_sene,renk) VALUES (?)`
    const values = [
        req.body.dersAd,
        req.body.dersKodu,
        req.body.kontenjan,
        req.params.id,
        req.body.sene,
        randomColor
       ]

    db.query(q2, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("ders eklendi");
    })
}

export const myLessons=(req,res)=>{
    const q=`SELECT d.ders_adi,dp.sinif_kodu,d.renk,d.sinif_sene,d.ders_kodu,d.kontenjan FROM ders as d
    join dersprogrami  as dp
    on d.ders_id=dp.ders_id
    where d.hoca_id= ?`
    db.query(q,[req.params.id],(err, data)=>{
        if (err) return res.json(err);
        const siniflar = data.map((row) => row);
        return res.status(200).json(siniflar);
    })
}

export const selectLesson=(req,res)=>{
    const studentId = req.params.id; // Öğrenci ID'sini al
    const ders_id = req.body.ders_id; // Ders ID'sini al

    // Öğrencinin zaten bu dersi aldığını kontrol et
    const q = "SELECT * FROM ogrenci    ders WHERE ogrenci_id = ? AND ders_id = ?";
    
    db.query(q, [studentId, ders_id], (err, data) => {
        if (err) return res.json(err);

        // Öğrencinin zaten bu dersi aldığı durumu
        if (data.length > 0) {
            return res.status(409).json("Bu ders zaten eklenmiş");
        }

        // Dersi öğrenciye kaydet
        const q2 = "INSERT INTO ogrenciders (ogrenci_id, ders_id) VALUES (?, ?)";
        
        db.query(q2, [studentId, ders_id], (err, data) => {
            if (err) return res.json(err);

            return res.status(200).json("Ders başarıyla eklendi");
        });
    });
}

export const studentLessons = (req, res) => {
    const studentId = req.params.id; // Öğrenci ID'sini al

    // Öğrencinin zaten bu dersi aldığını kontrol et
    const q = "SELECT sinifsenesi FROM ogrenciler WHERE ogrenci_id = ?";

    db.query(q, [studentId], (err, data) => {
        if (err) return res.json(err);

        // Öğrencinin sınıf senesi bilgisini al
        console.log(data)
        const sene = data[0];
        console.log(sene.sinifsenesi)

        // Dersleri öğrencinin sınıf senesine göre getir
        const q2 = "SELECT * FROM ders WHERE sinif_sene = ?";

        db.query(q2, [sene.sinifsenesi], (err, data) => {
            if (err) return res.json(err);

            return res.status(200).json(data);
        });
    });
};



function getRandomColor() {
    var colors = [
      "red", "orange", "amber", "yellow", "lime",
      "green", "emerald", "teal", "cyan", "sky blue",
      "indigo", "violet", "purple", "fuchsia", "pink", "rose"
    ];
  
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
  
  // Fonksiyonu kullanma örneği:
  
