var gulp = require( 'gulp' );
var fontSpider = require( 'gulp-font-spider' );

gulp.task('fontspider', function() {
    return gulp.src('./index.html')
        .pipe(fontSpider());
});

gulp.task('defualt', ['fontspider']);
