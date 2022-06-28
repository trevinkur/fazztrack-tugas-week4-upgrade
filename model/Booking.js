const db = require("../helper/db_connection.js")

module.exports = {
    getById: function (req,res){
        return new Promise((resolve,reject) => {
            db.query(`SELECT CONCAT(users.first_name, " ", users.last_name) AS fullname,
                schedule.schedule, schedule.show_time,
                schedule.cinema_id, schedule.movie_id, 
                booking_seat.seat
                FROM booking
                JOIN booking_seat
                  ON booking.booking_seat_id = booking_seat.booking_seat_id
                JOIN schedule 
                  ON booking.schedule_id = schedule.schedule_id
                JOIN users
                  ON booking.user_id = users.user_id
                WHERE users.user_id = "${req.params.id}"
                ` , (err,result1) => {
                if(err) {
                    console.log(err)
                        reject({
                            message: "ERROR, Server is down",
                            status: "500"
                        })
                }
                db.query(`SELECT cinema.cinema_name, movies.title
                FROM cinema, movies 
                WHERE cinema.cinema_id = "${result1[0].cinema_id}" AND movies.movie_id ="${result1[0].movie_id}"`, (err,result2) => {
                    if(err){
                        console.log(err)
                        reject({
                            message: "ERROR, Server is down",
                            status: "500"
                        })
                    }
                    console.log(result2)
                    const data = result1.map((item,i) => {
                        return { ...item, cinema_name: result2[0].cinema_name, movie_title: result2[0].title}
                    })
                    resolve({
                        message: "SUCCESS",
                        status: 200,
                        data: data
                            
                    })   
                }) 
               
            })
        })

    },

    get: function (req,res){
        return new Promise((resolve,reject) => {
            db.query(`SELECT *
                FROM booking
                JOIN booking_seat
                  ON booking.booking_seat_id = booking_seat.booking_seat_id
                JOIN schedule 
                  ON booking.schedule_id = schedule.schedule_id
                JOIN users
                  ON booking.user_id = users.user_id
                ` , (err,results) => {
                if(err) {
                    console.log(err)
                        reject({
                            message: "ERROR, Server is down",
                            status: "500"
                        })
                } 

                
                resolve({
                    message: "Success",
                    status: 200,
                    data: results
                })
            })
        })

    },

    add:function(req,res) {
        return new Promise ((resolve,reject) => {
            
            const {booking_seat_id, schedule_id, user_id, } = req.body
            db.query(`INSERT INTO booking (booking_seat_id, schedule_id, user_id) 
                VALUES ('${booking_seat_id}', '${schedule_id}', '${user_id}' );
                `, (err, results)=> {
                    if(err) {
                        console.log(err)
                      reject({
                        message: "ERROR, your input is wrong",
                        status: 404
                     })
                    }
                    resolve({
                        message: "Success",
                        status: 200,
                        data: results
                      })
                })
            db.query(` INSERT INTO invoice(invoice.booking_id, total_payment, count )
                SELECT booking.booking_id, SUM(booking_seat.price), 
                COUNT(booking.booking_id)
                FROM booking 
                JOIN booking_seat
                    ON booking.booking_seat_id = booking_seat.booking_seat_id
                JOIN payment_method
                  ON booking.payment_method_id = payment_method.payment_method_id
                WHERE user_id ="${req.body.user_id} "
                `, (err, results)=> {
                    if(err) {
                        console.log(err)
                        reject({
                            message: "ERROR, your input is wrong",
                            status: 404
                        })
                    }
                    resolve({
                        message: "Success",
                        status: 200,
                        data: results
                      })
               
            })
            
        })
    },

    update: function(req,res) {
        return new Promise ((resolve,reject) => {
            db.query(`SELECT * FROM booking WHERE booking_id="${req.params.id}"`, (err,result) => {
                const oldData = {
                    ...result[0],
                    ...req.body
                }
              
                const {booking_seat_id, schedule_id, user_id}  = oldData
                db.query(`UPDATE booking SET booking_seat_id="${booking_seat_id}",schedule_id="${schedule_id}", price="${user_id}}"
                WHERE booking_id="${req.params.id}"`, (err, results)=> {
                    console.log(err)
                    if(err) {
                      reject({
                        message: "ERROR, your input is wrong",
                        status: 404
                     })
                    }
                    resolve({
                      message: "Success",
                      status: 200,
                      data: results
                    })
                  })

            })

           
        })
    },

    removeById: function (req,res){
        return new Promise((resolve,reject) => {
            db.query(`DELETE FROM booking WHERE booking_id="${req.params.id}" ` , (err,result) => {
                if(err){
                    reject({
                        message: "ERROR, Server is down",
                        status: "500"
                    })
                }

                resolve({
                    message: "Berhasil",
                    status: 200,
                    data: result
                })   
            })
        })

    },
}