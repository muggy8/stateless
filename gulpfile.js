const gulp = require("gulp"),
    uglify = require('gulp-uglify')

gulp.task("default", function(){
    console.log("testing testing 123")

    return gulp.src("stateless.js")
        .pipe(uglify())
        .pipe(gulp.dest("stateless.mini.js"))
})
