# Generated by Django 2.2.3 on 2019-11-20 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_orderitem_saved_for_later'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedForLaterItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('price', models.FloatField()),
                ('discount_price', models.FloatField(blank=True, null=True)),
                ('genre', models.CharField(choices=[('AA', 'Action and adventure'), ('AH', 'Alternate history'), ('AT', 'Anthology'), ('CH', 'Childrens'), ('CO', 'Comic book'), ('CR', 'Crime'), ('DR', 'Drama'), ('FT', 'Fairytale'), ('FA', 'Fantasy'), ('GN', 'Graphic novel'), ('HF', 'Historical fiction'), ('HO', 'Horror'), ('MY', 'Mystery'), ('PO', 'Poetry'), ('PT', 'Political thriller'), ('RO', 'Romance'), ('SF', 'Science fiction'), ('SS', 'Short story'), ('SP', 'Suspense'), ('TH', 'Thriller'), ('AR', 'Art'), ('AB', 'Autobiography'), ('BO', 'Biography'), ('BR', 'Book review'), ('CB', 'Cookbook'), ('DI', 'Diary'), ('EN', 'Encyclopedia'), ('GU', 'Guide'), ('HE', 'Health'), ('HI', 'History'), ('JO', 'Journal'), ('MA', 'Math'), ('ME', 'Memoir'), ('RS', 'Religion, spirituality, and new age'), ('TB', 'Textbook'), ('RE', 'Review'), ('SC', 'Science'), ('SH', 'Self help'), ('TR', 'Travel')], max_length=2)),
                ('label', models.CharField(choices=[('F', 'Fiction'), ('N', 'Non-Fiction')], max_length=1)),
                ('slug', models.SlugField()),
                ('description', models.TextField()),
                ('image', models.ImageField(upload_to='')),
                ('publisher_info', models.TextField(blank=True, null=True)),
                ('author_name', models.TextField(blank=True, null=True)),
                ('author_bio', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='saved_for_later',
        ),
    ]