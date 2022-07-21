document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
	document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
	document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
	document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
  
	document.querySelector('#compose-form').addEventListener('submit', () => {
		send_email();
		//console.log('email sent');
		//load_mailbox('sent');
	});
});



function archive(email_id) {
	fetch(`/emails/${email_id}`, {
		method: 'PUT',
		body: JSON.stringify({
			archived: true
		})
	});
	
	console.log('email archived');
}

function unarchive(email_id) {
	fetch(`/emails/${email_id}`, {
		method: 'PUT',
		body: JSON.stringify({
			archived: false
		})
	});

	console.log('email unarchived');
}

function read(email_id) {
	fetch(`/emails/${email_id}`, {
		method: 'PUT',
		body: JSON.stringify({
			read: true
		})
	});
}

function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#email-viewer').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
	
	fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        emails.forEach(email => {
			email_list_view(email, mailbox);
		})
	});

}

function send_email(event) {
	fetch('/emails', {
		method: 'POST',
		body: JSON.stringify({
		  recipients: document.querySelector('#compose-recipients').value,
		  subject: document.querySelector('#compose-subject').value,
		  body: document.querySelector('#compose-body').value
		})
	})
	.then(response => response.json())
	.then(result => {
		// Print result
		console.log(result);
		
	});
	
	console.log('email sent');
	load_mailbox('sent');
	
}

function email_list_view(email, mailbox) {
	document.querySelector('#email-viewer').style.display = 'none';
	const email_listbox = document.createElement('div');
	email_listbox.className = 'emaillistbox';
	
	const email_info = document.createElement('div');
	
	const email_sub = document.createElement('h3');
	email_sub.innerHTML = email.subject;
	const email_sender = document.createElement('div');
	email_sender.innerHTML = "From: "+email.sender;
	const email_recipient = document.createElement('div');
	email_recipient.innerHTML = "To: "+email.recipients;
	const email_time = document.createElement('div');
	email_time.innerHTML = "at "+email.timestamp;
	
	// Email read status
	if (email.read) {
		email_info.style.backgroundColor = '#CECECE';
	} 
	else {
		email_info.style.backgroundColor = '#FFFFFF';
	}

	
	// Openning email
	email_info.addEventListener('click', () => {
		open_email(email.id);
	});
	
	const email_btns = document.createElement('div');
	
	// Archive/Unarchive button
	if (mailbox !== "sent") {
		if (email.archived) {
			const u_btn = document.createElement('button');
			u_btn.innerHTML = 'Unarchive';
			u_btn.className = 'btn btn-sm btn-outline-primary email_button';
			
			// Unarchive email
			u_btn.addEventListener('click', () => {
				unarchive(email.id);
				load_mailbox('inbox');
			})
			
			email_btns.append(u_btn);
		}
		else {
			const a_btn = document.createElement('button');
			a_btn.innerHTML = 'Archive';
			a_btn.className = 'btn btn-sm btn-outline-primary email_button';
			
			//Archive email
			a_btn.addEventListener('click', () => {
				archive(email.id);
				load_mailbox('inbox');
			})
			
			email_btns.append(a_btn);
		}
	}
	
	// Reply button
	const r_btn = document.createElement('button');
	r_btn.innerHTML = 'Reply';
	r_btn.className = 'btn btn-sm btn-outline-primary email_button';
	
	// Reply to email
	r_btn.addEventListener('click', () => {
		reply(email);
	});
	
	email_btns.append(r_btn)
	
	// Add elements to email_info
	email_info.append(email_sub)
	email_info.append(email_sender)
	email_info.append(email_recipient)
	email_info.append(email_time)
	
	// Add elements to email_listbox
	email_listbox.append(email_info)
	email_listbox.append(email_btns)
	
    // Add email_listbox to DOM
    document.querySelector('#emails-view').append(email_listbox);
}



function open_email(email_id) {
	fetch(`/emails/${email_id}`)
	.then(response => response.json())
	.then(email => {
		console.log(email);
		display(email);
		read(email.id);
	});
}



function display(email) {
	const disp = document.createElement('div');
	disp.className = 'container-large';

	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#email-viewer').style.display = 'block';
	
	const from = document.createElement('div');
	from.className = 'container-small';
	from.innerHTML = "From: " + email.sender;
	const to = document.createElement('div');
	to.className = 'container-small';
	to.innerHTML = "To: " + JSON.parse(JSON.stringify(email.recipients));
	const time = document.createElement('div');
	time.className = 'container-small';
	time.innerHTML = "At " + email.timestamp;
	const sub = document.createElement('div');
	sub.className = 'container-small';
	sub.innerHTML = "Subject: " + email.subject;
	const body = document.createElement('div');
	body.className = 'container-mid';
	body.innerHTML = email.body;
	
	disp.append(from);
	disp.append(to);
	disp.append(time);
	disp.append(sub);
	disp.append(body);
	
	document.querySelector('#email-viewer').innerHTML = 'block';
	document.querySelector('#email-viewer').append(disp);
}

function reply(email) {
	compose_email();
	
	document.querySelector('#compose-recipients').value = email.sender;
	document.querySelector('#compose-subject').value = "Re: " + email.subject;
	document.querySelector('#compose-body').value = "On " + email.timestamp + " " + email.sender + " wrote: " + email.body + "\n";
}





















