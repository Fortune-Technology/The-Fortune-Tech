const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const TestimonialSchema = new mongoose.Schema({}, { strict: false });
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

async function fixPaths() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/the-fortune-tech');
    console.log('Connected to DB');

    const testimonials = await Testimonial.find({});
    for (const t of testimonials) {
        let changed = false;

        const thumbnail = t.get('thumbnail');
        if (typeof thumbnail === 'string' && thumbnail.includes('/uploads/images/screenshot')) {
            const newThumbnail = thumbnail.replace('/uploads/images/', '/uploads/testimonials/');
            t.set('thumbnail', newThumbnail);
            changed = true;
        }

        const avatar = t.get('avatar');
        if (typeof avatar === 'string' && avatar.includes('/uploads/images/screenshot')) {
            const newAvatar = avatar.replace('/uploads/images/', '/uploads/testimonials/');
            t.set('avatar', newAvatar);
            changed = true;
        }

        // Also if avatar is the dummy seed name (e.g., michael-chen-avatar.png) that doesn't exist, we fallback to thumbnail if thumbnail exists
        if (typeof avatar === 'string' && avatar.includes('-avatar.png')) {
            if (typeof thumbnail === 'string' && !thumbnail.includes('-thumbnail.png') && !thumbnail.includes('-avatar.png')) {
                // thumbnail points to a real screenshot
                t.set('avatar', t.get('thumbnail'));
                changed = true;
            }
        }

        if (changed) {
            await t.save();
            console.log('Fixed testimonial:', t.get('name'));
        }
    }

    console.log('Done');
    process.exit(0);
}

fixPaths().catch(console.error);
