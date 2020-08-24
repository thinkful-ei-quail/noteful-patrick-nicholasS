truncate notes, folders restart identity cascade;

insert into folders
(name)
values
('Important'),
('Animals'),
('Aliens'),
('Robots');

insert into notes
(name, description, folder)
values
('School', 'Sucks', 1),
('Life', null, 1),
('Bear', 'Fluffly', 2),
('Wolf', 'howl', 2),
('Gray', null, 3),
('UFO', 'Flying stuff', 3),
('The Terminator', '1980s', 4),
('RoboCop', 'Also 1980s', 4);